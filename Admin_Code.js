// ==========================================
// School Admin Panel Backend (Admin Project)
// ==========================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Admin Panel - School Website')
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/355/355342.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function verifyAdmin(password) {
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
      return { code: row[0], title: row[1], author: row[2] || 'មិនបញ្ជាក់', category: row[3] || 'ទូទៅ', link: row[4] || '#', cover: row[5] || '', rowNum: idx + 2 };
    });
  } catch (error) {
    console.error(error);
    return getMockBooks();
  }
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

function deleteTeamRow(rowNum) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Team').deleteRow(rowNum);
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
      data.code, data.title, data.author, data.category, data.link, data.cover
    ]);
    return true;
  } catch(e) { return false; }
}

function addTeamMember(data) {
  if(SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Team').appendRow([
      data.name, data.role, data.photo, data.description
    ]);
    return true;
  } catch(e) { return false; }
}

function getMockNews() {
  return [
    { title: 'ពិធីបើកបវេសនកាលឆ្នាំសិក្សាថ្មី ២០២៤-២០២៥', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', date: '01/10/2024', content: 'សាលានឹងរៀបចំពិធីបើកបវេសនកាលឆ្នាំសិក្សាថ្មីនៅថ្ងៃទី ០១ ខែតុលា ឆ្នាំ២០២៤។' },
    { title: 'ការប្រកួតកីឡាអន្តរសាលាប្រចាំឆ្នាំ', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', date: '15/11/2024', content: 'អបអរសាទរក្រុមបាល់ទាត់សាលាយើងដែលបានទទួលចំណាត់ថ្នាក់លេខ១ ក្នុងការប្រកួតកីឡាអន្តរសាលាប្រចាំខេត្ត។' }
  ];
}

function getMockBooks() {
  return [
    { code: 'B001', title: 'ប្រវត្តិសាស្ត្រខ្មែរ', author: 'ត្រឹង ងា', category: 'ប្រវត្តិសាស្ត្រ', link: '#', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { code: 'B002', title: 'គណិតវិទ្យា ថ្នាក់ទី១២', author: 'ក្រសួងអប់រំ', category: 'វិទ្យាសាស្ត្រ', link: '#', cover: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400' }
  ];
}

function getTeamAdmin() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return getMockTeamAdmin();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Team');
    if (!sheet) return getMockTeamAdmin();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift(); 
    return data.map((row, idx) => {
      return { 
        name: row[0] || 'មិនបញ្ជាក់', 
        role: row[1] || 'មិនបញ្ជាក់', 
        photo: row[2] || '',
        description: row[3] || '',
        rowNum: idx + 2 
      };
    });
  } catch (error) {
    console.error(error);
    return getMockTeamAdmin();
  }
}

function getMockTeamAdmin() {
  return [
    { name: 'លោក នាយក ក', role: 'នាយកសាលា', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', description: 'បរិញ្ញាបត្រជាន់ខ្ពស់ គ្រប់គ្រងអប់រំ', rowNum: 2 },
    { name: 'លោកស្រី នាយករង ខ', role: 'នាយករង បច្ចេកទេស', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', description: 'បរិញ្ញាបត្រ គរុកោសល្យ', rowNum: 3 }
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
      data.code, data.title, data.author, data.category, data.link, data.grade
    ]);
    return true;
  } catch(e) { return false; }
}


function getDashboardStats() {
  const stats = {
    staffCount: 45,
    bookCount: 1204,
    messageCount: 12,
    memberCount: 850
  };
  
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    return stats;
  }
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    const staffSheet = ss.getSheetByName('Staff');
    if (staffSheet) stats.staffCount = Math.max(0, staffSheet.getLastRow() - 1);
    
    const bookSheet = ss.getSheetByName('Books');
    if (bookSheet) stats.bookCount = Math.max(0, bookSheet.getLastRow() - 1);
    
    const msgSheet = ss.getSheetByName('Messages');
    if (msgSheet) stats.messageCount = Math.max(0, msgSheet.getLastRow() - 1);
    
    const memberSheet = ss.getSheetByName('Members');
    if (memberSheet) stats.memberCount = Math.max(0, memberSheet.getLastRow() - 1);
    
    return stats;
  } catch(e) {
    console.error(e);
    return stats;
  }
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
    // Assuming row 2 is the actual data, column A is school name
    return { name: data[1][0] || defaultName };
  } catch(e) {
    return { name: defaultName };
  }
}

function saveSchoolSettings(name) {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Settings');
    if (!sheet) {
      sheet = ss.insertSheet('Settings');
      sheet.appendRow(['School Name', 'Address', 'Phone']);
    }
    // Update row 2
    sheet.getRange("A2").setValue(name);
    return true;
  } catch(e) {
    return false;
  }
}

// ==========================================
// School Structure Backend Logic
// ==========================================
function getMockStructure() {
  return [
    { id: '1', name: 'លោក នាយក ក', role: 'នាយកសាលា', level: 'director', department: 'គណៈគ្រប់គ្រង', photo: '', order: 1, rowNum: 2 },
    { id: '2', name: 'លោកស្រី នាយករង ខ', role: 'នាយករង (បច្ចេកទេស)', level: 'deputy', department: 'បច្ចេកទេស', photo: '', order: 2, rowNum: 3 },
    { id: '3', name: 'លោក នាយករង គ', role: 'នាយករង (រដ្ឋបាល)', level: 'deputy', department: 'រដ្ឋបាល', photo: '', order: 3, rowNum: 4 },
    { id: '4', name: 'លោកស្រី នាយករង ឃ', role: 'នាយករង (វិន័យ)', level: 'deputy', department: 'វិន័យ', photo: '', order: 4, rowNum: 5 }
  ];
}

function getStructureAdmin() {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return getMockStructure();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Structure');
    if (!sheet) return getMockStructure();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift();
    return data.map((row, idx) => ({
      name: row[0] || '',
      role: row[1] || '',
      level: row[2] || 'deputy',
      department: row[3] || '',
      photo: row[4] || '',
      order: row[5] || (idx + 1),
      rowNum: idx + 2
    }));
  } catch (error) {
    console.error(error);
    return getMockStructure();
  }
}

function addStructureMember(data) {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Structure');
    if (!sheet) {
      sheet = ss.insertSheet('Structure');
      sheet.appendRow(['Name', 'Role', 'Level', 'Department', 'Photo URL', 'Order']);
    }
    sheet.appendRow([data.name, data.role, data.level, data.department, data.photo, data.order]);
    return true;
  } catch (error) {
    return false;
  }
}

function updateStructureMember(data) {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Structure');
    if (!sheet || !data.rowNum) return false;
    sheet.getRange(data.rowNum, 1, 1, 6).setValues([[data.name, data.role, data.level, data.department, data.photo, data.order]]);
    return true;
  } catch (error) {
    return false;
  }
}

function deleteStructureRow(rowNum) {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') return true;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Structure');
    if (!sheet) return false;
    sheet.deleteRow(rowNum);
    return true;
  } catch (error) {
    return false;
  }
}

