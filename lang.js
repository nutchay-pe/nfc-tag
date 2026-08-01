// ============================================================
// NFC TAG - Language System
// ============================================================

const LANG = {
  th: {
    // index.html
    contactOwner: "ติดต่อเจ้าของ",
    callOwner: "📞 โทรหาเจ้าของ",
    socialAccount: "บัญชีโซเชียล",
    lostStatus: "ของสูญหาย / กรุณาช่วยติดต่อ",
    hiddenMode: "ซ่อนข้อมูล",
    labelFacebook: "เฟซบุ๊ก",
    youtubeSubtitle: "ช่องวิดีโอ",
    additionalInfo: "ข้อมูลเพิ่มเติม",
    phoneLabel: "เบอร์โทร",
    messageLabel: "ข้อความเพิ่มเติม",
    normalStatus: "สถานะปกติ",
    regPageTitle: "ลงทะเบียนข้อมูลลูกค้า",
    regLoginTitle: "ลงชื่อบัญชีผู้ใช้งาน",
    regLoginSubtitle: "กรอกข้อมูลเพื่อเข้าสู่ระบบแก้ไขข้อมูล",
    labelTagline: "ข้อความใต้ชื่อ",
    labelEmail: "อีเมล",
    labelMessage: "ข้อความ",
    labelDisplayMode: "โหมดการแสดงผลหน้าโปรไฟล์",
    displayNormal: "แสดงข้อมูลปกติ",
    displayHidden: "ไม่ต้องการให้แสดงข้อมูลส่วนตัว",
    labelUpload: "อัปโหลดรูปภาพ",
    profileLink: "ลิงก์หน้าโปรไฟล์",
    loadSuccess: "โหลดข้อมูลสำเร็จ พร้อมแก้ไขได้เลย รหัสลูกค้า:",
    verifyError: "กรุณากรอกรหัสลูกค้า รหัสผ่าน และรหัสผ่านขั้นที่ 2",
    imageSizeError: "รูปภาพต้องมีขนาดไม่เกิน 5MB",
    uploadError: "อัปโหลดรูปไม่สำเร็จ",
    saveError: "บันทึกไม่สำเร็จ",
    saveSuccess: "บันทึกข้อมูลสำเร็จ รหัสลูกค้า:",
    privacySection1: "เราเก็บข้อมูลอะไรบ้าง?",
    privacySection2: "นำข้อมูลไปใช้ทำอะไร?",
    privacySection3: "ข้อมูลเก็บไว้ที่ไหน?",
    privacySection4: "สิทธิ์ของคุณ",
    privacyItem1: "ชื่อ-นามสกุล",
    privacyItem2: "เบอร์โทรศัพท์",
    privacyItem3: "Line ID / อีเมล",
    privacyItem4: "ลิงก์โซเชียลมีเดีย (Facebook, Instagram, TikTok ฯลฯ)",
    privacyItem5: "รูปภาพโปรไฟล์",
    privacyItem6: "แสดงบนหน้าโปรไฟล์ NFC tag ของคุณเท่านั้น",
    privacyItem7: "ให้ผู้ที่สแกน NFC tag สามารถติดต่อคุณได้",
    privacyItem8: "ไม่นำข้อมูลไปขาย หรือแชร์กับบุคคลภายนอก",
    privacyItem9: "เก็บใน Google Sheets ของผู้ให้บริการ",
    privacyItem10: "รูปภาพเก็บใน Google Drive",
    privacyItem11: "มีการเข้ารหัสรหัสผ่านด้วย SHA-256",
    privacyItem12: "แก้ไขข้อมูลได้ตลอดเวลา",
    privacyItem13: "ขอลบข้อมูลได้โดยติดต่อผู้ให้บริการ",
    privacyFooter: "หากมีคำถามเพิ่มเติม กรุณาติดต่อผู้ให้บริการ NFC tag ของคุณ",
    errorStatus: "เกิดข้อผิดพลาด",
    loading: "กำลังโหลดข้อมูล...",
    pleaseWait: "กรุณารอสักครู่...",
    emailLabel: "อีเมล",
    noIdError: "ไม่พบ id ใน URL",
    notFound: "ไม่พบข้อมูล",
    loadError: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    defaultNotice: "ติดต่อเจ้าของได้เลย 💖",

    // register.html
    pageTitle: "ลงทะเบียน / แก้ไขข้อมูลลูกค้า",
    pageSubtitle: "กรอกข้อมูลเพื่อใช้แสดงบนหน้า NFC luggage tag",
    labelId: "รหัสลูกค้า (id)",
    labelUsername: "ชื่อผู้ใช้ (Username)",
    labelPassword: "รหัสผ่าน (Password)",
    btnVerify: "ยืนยันเพื่อแก้ไขข้อมูล",
    labelName: "ชื่อ",
    labelTagline: "คำอธิบาย",
    labelRating: "เบอร์โทรศัพท์",
    labelPhone: "เบอร์โทรศัพท์",
    labelLineId: "Line ID",
    labelEmail: "Email",
    labelMessage: "ข้อความสั้น",
    labelTemplate: "เทมเพลต",
    labelImageUrl: "รูปภาพ",
    labelStatus: "สถานะ",
    labelFacebook: "Facebook",
    labelInstagram: "Instagram",
    labelTiktok: "TikTok",
    labelYoutube: "YouTube",
    labelX: "X (Twitter)",
    labelWechat: "WeChat",
    labelWhatsapp: "WhatsApp",
    labelDisplayMode: "โหมดแสดงผล",
    btnSave: "บันทึกข้อมูล",
    changePassTitle: "🔑 เปลี่ยนรหัสผ่าน",
    changePassHint: "กรอกเฉพาะเมื่อต้องการเปลี่ยนรหัส ถ้าไม่กรอกรหัสเดิมจะถูกใช้ต่อไป",
    labelNewEditCode: "รหัสแก้ไขใหม่ (Edit Code ใหม่)",
    labelNewPassword: "รหัสผ่านใหม่ (Password ใหม่)",
    labelConfirmPassword: "ยืนยันรหัสผ่านใหม่",
    consentText: "ฉันยินยอมให้เก็บข้อมูลส่วนตัว",
    consentLink: "อ่านรายละเอียด",
    privacyTitle: "📋 นโยบายการเก็บข้อมูลส่วนบุคคล",
    btnAccept: "✅ ยอมรับและปิด",
    errorInvalidId: "รหัสลูกค้า หรือรหัสผ่านไม่ถูกต้อง",
    successSave: "บันทึกสำเร็จ!",
    errorSave: "บันทึกไม่สำเร็จ",
  },

  en: {
    // index.html
    contactOwner: "Contact Owner",
    callOwner: "📞 Call Owner",
    socialAccount: "Social Account",
    lostStatus: "Lost Item / Please Help Contact Owner",
    hiddenMode: "Hidden",
    labelFacebook: "Facebook",
    youtubeSubtitle: "Video Channel",
    additionalInfo: "Additional Info",
    phoneLabel: "Phone",
    messageLabel: "Message",
    normalStatus: "Normal",
    regPageTitle: "Customer Registration",
    regLoginTitle: "Sign In",
    regLoginSubtitle: "Enter your credentials to edit profile",
    labelTagline: "Tagline",
    labelEmail: "Email",
    labelMessage: "Message",
    labelDisplayMode: "Profile Display Mode",
    displayNormal: "Show full profile",
    displayHidden: "Show background only",
    labelUpload: "Upload Image",
    profileLink: "Profile Link",
    loadSuccess: "Loaded successfully. Customer ID:",
    verifyError: "Please enter customer ID, password and secondary password",
    imageSizeError: "Image must be under 5MB",
    uploadError: "Upload failed",
    saveError: "Save failed",
    saveSuccess: "Saved successfully. Customer ID:",
    privacySection1: "What data do we collect?",
    privacySection2: "How do we use your data?",
    privacySection3: "Where is your data stored?",
    privacySection4: "Your rights",
    privacyItem1: "Full name",
    privacyItem2: "Phone number",
    privacyItem3: "Line ID / Email",
    privacyItem4: "Social media links (Facebook, Instagram, TikTok etc.)",
    privacyItem5: "Profile image",
    privacyItem6: "Displayed on your NFC tag profile page only",
    privacyItem7: "To allow people who scan your NFC tag to contact you",
    privacyItem8: "We do not sell or share your data with third parties",
    privacyItem9: "Stored in Google Sheets of the service provider",
    privacyItem10: "Images stored in Google Drive",
    privacyItem11: "Passwords encrypted with SHA-256",
    privacyItem12: "You can edit your data at any time",
    privacyItem13: "You can request deletion by contacting the service provider",
    privacyFooter: "If you have any questions, please contact your NFC tag service provider",
    errorStatus: "Error",
    loading: "Loading...",
    pleaseWait: "Please wait...",
    emailLabel: "Email",
    noIdError: "No ID found in URL",
    notFound: "Profile not found",
    loadError: "Error loading data",
    defaultNotice: "Contact owner 💖",

    // register.html
    pageTitle: "Register / Edit Customer Info",
    pageSubtitle: "Fill in information to display on NFC luggage tag",
    labelId: "Customer ID",
    labelUsername: "Username",
    labelPassword: "Password",
    btnVerify: "Verify to Edit",
    labelName: "Name",
    labelTagline: "Description",
    labelRating: "Phone Number",
    labelPhone: "Phone Number",
    labelLineId: "Line ID",
    labelEmail: "Email",
    labelMessage: "Short Message",
    labelTemplate: "Template",
    labelImageUrl: "Profile Image",
    labelStatus: "Status",
    labelFacebook: "Facebook",
    labelInstagram: "Instagram",
    labelTiktok: "TikTok",
    labelYoutube: "YouTube",
    labelX: "X (Twitter)",
    labelWechat: "WeChat",
    labelWhatsapp: "WhatsApp",
    labelDisplayMode: "Display Mode",
    btnSave: "Save",
    changePassTitle: "🔑 Change Password",
    changePassHint: "Fill only when you want to change password. Leave blank to keep current password.",
    labelNewEditCode: "New Edit Code",
    labelNewPassword: "New Password",
    labelConfirmPassword: "Confirm New Password",
    consentText: "I consent to the collection of my personal data",
    consentLink: "Read details",
    privacyTitle: "📋 Privacy Policy",
    btnAccept: "✅ Accept & Close",
    errorInvalidId: "Invalid customer ID or password",
    successSave: "Saved successfully!",
    errorSave: "Save failed",
  }
};

let currentLang = "th";

function setLang(lang) {
  currentLang = lang;
  applyLang();
  updateToggleBtn();
  reapplyDynamic();
}

function reapplyDynamic() {
  // Re-apply ข้อความที่ถูก set โดย script.js ตอน load
  const statusBadge = document.getElementById("statusBadge");
  if (statusBadge) {
    if (statusBadge.classList.contains("lost")) {
      statusBadge.textContent = getLang("lostStatus");
    } else {
      statusBadge.textContent = getLang("normalStatus");
    }
  }
}

function applyLang() {
  const t = LANG[currentLang];
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-lang-placeholder]").forEach(el => {
    const key = el.getAttribute("data-lang-placeholder");
    if (t[key] !== undefined) el.placeholder = t[key];
  });
}

function updateToggleBtn() {
  const btn = document.getElementById("langToggleBtn");
  if (!btn) return;
  btn.innerHTML = currentLang === "th"
    ? "🇬🇧 EN"
    : "🇹🇭 TH";
}

function toggleLang() {
  setLang(currentLang === "th" ? "en" : "th");
}

function getLang(key) {
  return LANG[currentLang][key] || key;
}