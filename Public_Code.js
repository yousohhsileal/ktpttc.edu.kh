// ==========================================
// School Website Backend (Public Project)
// ==========================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; 
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';     

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('School Official Website')
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/355/355342.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getNewsAndEvents() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return getMockNews();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('News_Events');
    if (!sheet) return getMockNews();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return []; 
    data.shift();
    return data.map((row, idx) => {
      let formattedDate = row[2];
      if (row[2] instanceof Date) {
        formattedDate = Utilities.formatDate(row[2], Session.getScriptTimeZone(), "dd/MM/yyyy");
      }
      return {
        title: row[0] || 'គ្មានចំណងជើង',
        image: row[1] || 'https://via.placeholder.com/400x250?text=No+Image',
        date: formattedDate || 'មិនបញ្ជាក់កាលបរិច្ឆេទ',
        content: row[3] || '',
        rowNum: idx + 2
      };
    }).reverse(); 
  } catch (error) {
    console.error(error);
    return getMockNews();
  }
}


function getBooks() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return getMockBooks();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Books');
    if (!sheet) return getMockBooks();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift(); 
    return data.map((row, idx) => {
      return { code: row[0], title: row[1], author: row[2] || 'មិនបញ្ជាក់', category: row[3] || 'ទូទៅ', link: row[4] || '#', rowNum: idx + 2 };
    });
  } catch (error) {
    console.error(error);
    return getMockBooks();
  }
}


function submitContactForm(formData) {
  try {
    const { name, contact, subject, message } = formData;
    const formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    
    if (SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName('Messages');
      if (!sheet) {
        sheet = ss.insertSheet('Messages');
        sheet.appendRow(['Date', 'Name', 'Contact', 'Subject', 'Message']);
        sheet.getRange("A1:E1").setFontWeight("bold");
      }
      sheet.appendRow([formattedDate, name, contact, subject, message]);
    }
    
    if (TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' && TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE') {
      const text = `🔔 <b>សារថ្មីពីវេបសាយសាលា</b>\n\n👤 <b>ឈ្មោះ:</b> ${name}\n📞 <b>ទំនាក់ទំនង:</b> ${contact}\n📌 <b>ប្រធានបទ:</b> ${subject}\n✉️ <b>សារ:</b> ${message}`;
      UrlFetchApp.fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'post', contentType: 'application/json',
        payload: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'HTML' }),
        muteHttpExceptions: true
      });
    }
    return { success: true, message: 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។ អរគុណ!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'មានបញ្ហាក្នុងការផ្ញើសារ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។' };
  }
}


function getMockNews() {
  return [
    { title: 'ពិធីបើកបវេសនកាលឆ្នាំសិក្សាថ្មី ២០២៤-២០២៥', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', date: '01/10/2024', content: 'សាលានឹងរៀបចំពិធីបើកបវេសនកាលឆ្នាំសិក្សាថ្មីនៅថ្ងៃទី ០១ ខែតុលា ឆ្នាំ២០២៤។' },
    { title: 'ការប្រកួតកីឡាអន្តរសាលាប្រចាំឆ្នាំ', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', date: '15/11/2024', content: 'អបអរសាទរក្រុមបាល់ទាត់សាលាយើងដែលបានទទួលចំណាត់ថ្នាក់លេខ១ ក្នុងការប្រកួតកីឡាអន្តរសាលាប្រចាំខេត្ត។' }
  ];
}

function getMockBooks() {
  return [
    { code: 'B001', title: 'ប្រវត្តិសាស្ត្រខ្មែរ', author: 'ត្រឹង ងា', category: 'ប្រវត្តិសាស្ត្រ', link: '#' },
    { code: 'B002', title: 'គណិតវិទ្យា ថ្នាក់ទី១២', author: 'ក្រសួងអប់រំ', category: 'វិទ្យាសាស្ត្រ', link: '#' }
  ];
}

function getTeam() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return getMockTeam();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Team');
    if (!sheet) return getMockTeam();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift(); 
    return data.map((row, idx) => {
      return { 
        name: row[0] || 'មិនបញ្ជាក់', 
        role: row[1] || 'មិនបញ្ជាក់', 
        photo: row[2] || 'https://via.placeholder.com/400?text=No+Photo',
        description: row[3] || '',
        rowNum: idx + 2 
      };
    });
  } catch (error) {
    console.error(error);
    return getMockTeam();
  }
}

function getMockTeam() {
  return [
    { name: 'លោក នាយក ក', role: 'នាយកសាលា', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', description: 'បរិញ្ញាបត្រជាន់ខ្ពស់ គ្រប់គ្រងអប់រំ' },
    { name: 'លោកស្រី នាយករង ខ', role: 'នាយករង បច្ចេកទេស', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', description: 'បរិញ្ញាបត្រ គរុកោសល្យ' },
    { name: 'លោក នាយករង គ', role: 'នាយករង រដ្ឋបាល', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', description: 'បរិញ្ញាបត្រ រដ្ឋបាលសាធារណៈ' }
  ];
}

function verifyAdmin(password) {
  // ប្រើប្រាស់លេខសម្ងាត់ admin123 ជាបណ្ដោះអាសន្ន
  return password === 'admin123';
}

function getMessages() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return [];
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Messages');
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift();
    return data.map(row => ({
      date: row[0], name: row[1], contact: row[2], subject: row[3], message: row[4]
    })).reverse();
  } catch (error) { return []; }
}


function deleteNewsRow(rowNum) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('News_Events').deleteRow(rowNum);
    return true;
  } catch(e) { return false; }
}

function deleteBookRow(rowNum) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Books').deleteRow(rowNum);
    return true;
  } catch(e) { return false; }
}

function addNews(data) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('News_Events').appendRow([
      data.title, data.image, data.date, data.content
    ]);
    return true;
  } catch(e) { return false; }
}

function addBook(data) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Books').appendRow([
      data.code, data.title, data.author, data.category, data.link
    ]);
    return true;
  } catch(e) { return false; }
}

function getSchoolSettings() {
  const defaultName = "សាលាគរុកោសល្យ និងវិក្រឹតការខេត្តក្រចេះ";
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return { name: defaultName };
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Settings');
    if (!sheet) return { name: defaultName };
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { name: defaultName };
    return { name: data[1][0] || defaultName };
  } catch(e) {
    return { name: defaultName };
  }
}

function getStructureData() {
  const defaultStructure = [
    { id: '1', name: 'លោក នាយក ក', role: 'នាយកសាលា', level: 'director', department: 'គណៈគ្រប់គ្រង', photo: '', order: 1 },
    { id: '2', name: 'លោកស្រី នាយករង ខ', role: 'នាយករង (បច្ចេកទេស)', level: 'deputy', department: 'បច្ចេកទេស', photo: '', order: 2 },
    { id: '3', name: 'លោក នាយករង គ', role: 'នាយករង (រដ្ឋបាល)', level: 'deputy', department: 'រដ្ឋបាល', photo: '', order: 3 },
    { id: '4', name: 'លោកស្រី នាយករង ឃ', role: 'នាយករង (វិន័យ)', level: 'deputy', department: 'វិន័យ', photo: '', order: 4 }
  ];
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return defaultStructure;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Structure');
    if (!sheet) return defaultStructure;
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return defaultStructure;
    data.shift();
    return data.map((row, idx) => ({
      name: row[0] || '',
      role: row[1] || '',
      level: row[2] || 'deputy',
      department: row[3] || '',
      photo: row[4] || '',
      order: row[5] || (idx + 1)
    }));
  } catch (error) {
    console.error(error);
    return defaultStructure;
  }
}

