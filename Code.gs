function doGet(e) {
  const action = (e.parameter.action || "getProfile").trim();

  if (action === "getProfile") {
    return getProfile(e);
  }

  if (action === "saveProfile") {
    return saveProfile(e);
  }

  if (action === "verifyEditAccess") {
    return verifyEditAccess(e);
  }

  if (action === "uploadImage") {
    return uploadImage(e);
  }


  return jsonOutput({
    success: false,
    message: "Invalid action"
  });
}



function testDriveAccess() {
  const folderId = "1YZ5m80CHPFhTWynHxgpYrNmhLZfrC5h1";
  const folder = DriveApp.getFolderById(folderId);
  Logger.log(folder.getName());
}


function testCreateFile() {
  const folderId = "1YZ5m80CHPFhTWynHxgpYrNmhLZfrC5h1";
  const folder = DriveApp.getFolderById(folderId);

  const blob = Utilities.newBlob("test file", "text/plain", "test-upload.txt");
  const file = folder.createFile(blob);

  Logger.log(file.getId());
  Logger.log(file.getUrl());
}





function uploadImage(e) {
  try {
    const fileName = (e.parameter.fileName || "").trim();
    const mimeType = (e.parameter.mimeType || "").trim();
    const fileData = (e.parameter.fileData || "").trim();

    if (!fileName || !mimeType || !fileData) {
      return jsonOutput({
        success: false,
        message: "Missing file data"
      });
    }

    const folderId = "1YZ5m80CHPFhTWynHxgpYrNmhLZfrC5h1";
    const folder = DriveApp.getFolderById(folderId);

    const bytes = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(bytes, mimeType, fileName);

    const file = folder.createFile(blob);

    const imageUrl = `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`;

    return jsonOutput({
      success: true,
      imageUrl: imageUrl,
      fileId: file.getId()
    });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message
    });
  }
}


function doPost(e) {
  return doGet(e);
}

function getSheet() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("CustomerData");
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getHeaderIndexMap(headers) {
  const map = {};
  headers.forEach((header, index) => {
    map[String(header).trim()] = index;
  });
  return map;
}

function findRowById(data, id, idIndex) {
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex] || "").trim() === id) {
      return {
        rowNumber: i + 1,
        rowData: data[i]
      };
    }
  }

  return {
    rowNumber: -1,
    rowData: null
  };
}

function verifyEditAccess(e) {
  const id = (e.parameter.id || "").trim();
  const editCode = (e.parameter.editCode || "").trim();
  const password2 = (e.parameter.password2 || "").trim();

  if (!id || !editCode || !password2) {
    return jsonOutput({
      success: false,
      message: "Missing id, editCode, or password2"
    });
  }

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  if (!data || data.length === 0) {
    return jsonOutput({
      success: false,
      message: "Sheet is empty"
    });
  }

  const headers = data[0];
  const headerMap = getHeaderIndexMap(headers);

  if (
    headerMap.id === undefined ||
    headerMap.editCode === undefined ||
    headerMap.password2 === undefined
  ) {
    return jsonOutput({
      success: false,
      message: "Missing required columns"
    });
  }

  const found = findRowById(data, id, headerMap.id);

  if (found.rowNumber === -1 || !found.rowData) {
    return jsonOutput({
      success: false,
      message: "Invalid credentials"
    });
  }

  const savedEditCode = String(found.rowData[headerMap.editCode] || "").trim();
  const savedPassword2 = String(found.rowData[headerMap.password2] || "").trim();

  if (savedEditCode !== editCode || savedPassword2 !== password2) {
    return jsonOutput({
      success: false,
      message: "Invalid credentials"
    });
  }

  return jsonOutput({
    success: true,
    message: "Access granted"
  });
}

function getProfile(e) {
  const id = (e.parameter.id || "").trim();

  if (!id) {
    return jsonOutput({
      success: false,
      message: "Missing id"
    });
  }

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  if (!data || data.length === 0) {
    return jsonOutput({
      success: false,
      message: "Sheet is empty"
    });
  }

  const headers = data[0];
  const headerMap = getHeaderIndexMap(headers);

  if (headerMap.id === undefined) {
    return jsonOutput({
      success: false,
      message: "Missing id column"
    });
  }

  const found = findRowById(data, id, headerMap.id);

  if (found.rowNumber === -1 || !found.rowData) {
    return jsonOutput({
      success: false,
      message: "Profile not found"
    });
  }

  const result = {};
  headers.forEach((header, index) => {
    result[String(header).trim()] = found.rowData[index];
  });

  return jsonOutput({
    success: true,
    data: result
  });
}

function saveProfile(e) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  if (!data || data.length === 0) {
    return jsonOutput({
      success: false,
      message: "Sheet is empty"
    });
  }

  const headers = data[0];
  const headerMap = getHeaderIndexMap(headers);
  const inputEditCode = (e.parameter.editCode || "").trim();

  if (headerMap.id === undefined || headerMap.editCode === undefined) {
    return jsonOutput({
      success: false,
      message: "Missing required columns"
    });
  }

  const payload = {
    id: (e.parameter.id || "").trim(),
    name: (e.parameter.name || "").trim(),
    password2: (e.parameter.password2 || "").trim(),
    tagline: (e.parameter.tagline || "").trim(),
    phone: (e.parameter.phone || "").trim(),
    lineId: (e.parameter.lineId || "").trim(),
    email: (e.parameter.email || "").trim(),
    message: (e.parameter.message || "").trim(),
    template: (e.parameter.template || "minimal").trim(),
    imageUrl: (e.parameter.imageUrl || "").trim(),
    status: (e.parameter.status || "normal").trim(),
    lastUpdated: Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    ),
    displayMode: (e.parameter.displayMode || "show").trim(),
    editCode: inputEditCode,

    facebook: (e.parameter.facebook || "").trim(),
    instagram: (e.parameter.instagram || "").trim(),
    tiktok: (e.parameter.tiktok || "").trim(),
    youtube: (e.parameter.youtube || "").trim(),
    x: (e.parameter.x || "").trim(),
    wechat: (e.parameter.wechat || "").trim(),
    whatsapp: (e.parameter.whatsapp || "").trim()
  };

  if (!payload.id) {
    return jsonOutput({
      success: false,
      message: "Missing id"
    });
  }

  const found = findRowById(data, payload.id, headerMap.id);

  if (found.rowNumber > -1) {
  const savedEditCode = String(found.rowData[headerMap.editCode] || "").trim();
  const savedPassword2 = String(found.rowData[headerMap.password2] || "").trim();

  if (
    !payload.editCode ||
    !payload.password2 ||
    payload.editCode !== savedEditCode ||
    payload.password2 !== savedPassword2
  ) {
    return jsonOutput({
      success: false,
      message: "Invalid password"
    });
  }
  }

  if (
  headerMap.id === undefined ||
  headerMap.editCode === undefined ||
  headerMap.password2 === undefined
  ) 
  {
  return jsonOutput({
    success: false,
    message: "Missing required columns"
  });
  }

  const rowValues = headers.map(header => {
    const key = String(header).trim();
    return payload[key] !== undefined ? payload[key] : "";
  });

  if (found.rowNumber > -1) {
    sheet.getRange(found.rowNumber, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return jsonOutput({
    success: true,
    message: "Profile saved successfully",
    data: payload
  });




}