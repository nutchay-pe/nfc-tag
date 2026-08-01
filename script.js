const profileCard = document.getElementById("profileCard");
const ownerName = document.getElementById("ownerName");
const avatar = document.getElementById("avatar");
const profileImage = document.getElementById("profileImage");
const statusBadge = document.getElementById("statusBadge");
const noticeBox = document.getElementById("noticeBox");
const callBtn = document.getElementById("callBtn");
const lineBtn = document.getElementById("lineBtn");
const phoneText = document.getElementById("phoneText");
const extraText = document.getElementById("extraText");
const hiddenModeView = document.getElementById("hiddenModeView");
const emailItem = document.getElementById("emailItem");
const emailText = document.getElementById("emailText");
const editMiniBtn = document.getElementById("editMiniBtn");
const editMiniBtn2 = document.getElementById("editMiniBtn2");
const socialCardList = document.getElementById("socialCardList");
const facebookCard = document.getElementById("facebookCard");
const instagramCard = document.getElementById("instagramCard");
const tiktokCard = document.getElementById("tiktokCard");
const youtubeCard = document.getElementById("youtubeCard");
const xCard = document.getElementById("xCard");
const wechatCard = document.getElementById("wechatCard");
const whatsappCard = document.getElementById("whatsappCard");
const lineCard = document.getElementById("lineCard");
const taglineText = document.getElementById("taglineText");

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getBaseUrl() {
  return window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
}

function isNotEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

async function loadProfile() {
  const id = getIdFromUrl();

  if (!id) {
    showError(typeof getLang !== "undefined" ? getLang("noIdError") : "ไม่พบ id ใน URL");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("profiles_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Load error:", error);
      showError(typeof getLang !== "undefined" ? getLang("loadError") : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      return;
    }

    if (!data) {
      showError(typeof getLang !== "undefined" ? getLang("notFound") : "ไม่พบข้อมูล");
      return;
    }

    renderProfile({
      id: data.id,
      name: data.name,
      tagline: data.tagline,
      phone: data.phone,
      lineId: data.line_id,
      email: data.email,
      message: data.message,
      template: data.template,
      imageUrl: data.image_url,
      status: data.status,
      displayMode: data.display_mode,
      facebook: data.facebook,
      instagram: data.instagram,
      tiktok: data.tiktok,
      youtube: data.youtube,
      x: data.x,
      wechat: data.wechat,
      whatsapp: data.whatsapp
    });
  } catch (error) {
    console.error("Load error:", error);
    showError(typeof getLang !== "undefined" ? getLang("loadError") : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }
}

function applyTemplate(templateName) {
  const template = String(templateName || "minimal").toLowerCase();

  document.body.classList.remove("theme-minimal", "theme-travel", "theme-business");
  profileCard.classList.remove("template-minimal", "template-travel", "template-business");

  if (template === "travel") {
    document.body.classList.add("theme-travel");
    profileCard.classList.add("template-travel");
    return;
  }

  if (template === "business") {
    document.body.classList.add("theme-business");
    profileCard.classList.add("template-business");
    return;
  }

  document.body.classList.add("theme-minimal");
  profileCard.classList.add("template-minimal");
}

function applyDisplayMode(data) {
  const mode = String(data.displayMode || "show").toLowerCase();

  if (mode === "hidden") {
    profileCard.style.display = "none";
    hiddenModeView.classList.remove("hidden");
    // แสดงปุ่ม edit ใน hidden mode ด้วย
    const hiddenId = getIdFromUrl();
    if (hiddenId && editMiniBtn2) {
      editMiniBtn2.href = `${getBaseUrl()}register.html?id=${encodeURIComponent(hiddenId)}`;
      editMiniBtn2.classList.remove("hidden");
    }
    return false;
  }

  profileCard.style.display = "block";
  hiddenModeView.classList.add("hidden");
  return true;
}

function toggleSocialButton(buttonElement, url) {
  if (url && String(url).trim() !== "") {
    buttonElement.href = String(url).trim();
    buttonElement.style.display = "flex";
    buttonElement.classList.remove("hidden");
  } else {
    buttonElement.href = "#";
    buttonElement.style.display = "none";
    buttonElement.classList.add("hidden");
  }
}

function toggleSocialCard(cardElement, url) {
  if (url && String(url).trim() !== "") {
    cardElement.href = String(url).trim();
    cardElement.style.display = "flex";
    cardElement.classList.remove("hidden");
    return true;
  } else {
    cardElement.href = "#";
    cardElement.style.display = "none";
    cardElement.classList.add("hidden");
    return false;
  }
}


function renderProfile(data) {
  profileCard.classList.remove("hidden");
  applyTemplate(data.template);

  const shouldShowProfile = applyDisplayMode(data);
  if (!shouldShowProfile) {
    return;
  }

  ownerName.textContent = isNotEmpty(data.name) ? data.name : "-";
  avatar.textContent = isNotEmpty(data.name)
    ? String(data.name).charAt(0).toUpperCase()
    : "?";

    if (data.tagline && String(data.tagline).trim() !== "") {
      taglineText.textContent = data.tagline;
      taglineText.style.display = "block";
    } else {
      taglineText.textContent = "";
      taglineText.style.display = "none";
    } 



  noticeBox.textContent = isNotEmpty(data.message)
    ? data.message
    : (typeof getLang !== "undefined" ? getLang("defaultNotice") : "ติดต่อเจ้าของได้เลย 💖");

  if (phoneText) phoneText.textContent = isNotEmpty(data.phone) ? data.phone : "-";
  extraText.textContent = isNotEmpty(data.message) ? data.message : "-";

  if (isNotEmpty(data.email)) {
    emailText.textContent = data.email;
    emailItem.style.display = "block";
  } else {
    emailText.textContent = "";
    emailItem.style.display = "none";
  }

  if (isNotEmpty(data.phone)) {
    callBtn.href = `tel:${String(data.phone).trim()}`;
    callBtn.style.display = "flex";
  } else {
    callBtn.style.display = "none";
  }

  
    const hasLine = toggleSocialCard(
      lineCard,
      isNotEmpty(data.lineId)
        ? (() => {
          const lineVal = String(data.lineId).trim();
          // ถ้าเป็น URL อยู่แล้ว ใช้ตรงๆ
          if (lineVal.startsWith("http://") || lineVal.startsWith("https://") || lineVal.startsWith("line://")) {
            return lineVal;
          }
          // ถ้าเป็น ID ให้เติม prefix
          const cleanId = lineVal.startsWith("@") ? lineVal.slice(1) : lineVal;
          return `https://line.me/ti/p/~${encodeURIComponent(cleanId)}`;
        })()
        : ""
    );

    const hasWhatsapp = toggleSocialCard(whatsappCard, data.whatsapp);
    const hasInstagram = toggleSocialCard(instagramCard, data.instagram);
    const hasFacebook = toggleSocialCard(facebookCard, data.facebook);
    const hasX = toggleSocialCard(xCard, data.x);
    const hasWechat = toggleSocialCard(wechatCard, data.wechat);
    const hasYoutube = toggleSocialCard(youtubeCard, data.youtube);
    const hasTiktok = toggleSocialCard(tiktokCard, data.tiktok);

    if (
      hasLine ||
      hasWhatsapp ||
      hasInstagram ||
      hasFacebook ||
      hasX ||
      hasWechat ||
      hasYoutube ||
      hasTiktok
    ) {
      socialCardList.style.display = "grid";
      socialCardList.classList.remove("hidden");
    } else {
      socialCardList.style.display = "none";
      socialCardList.classList.add("hidden");
    }

    const visibleCards = Array.from(socialCardList.querySelectorAll(".link-card-item")).filter(
      (card) => !card.classList.contains("hidden")
    );
    visibleCards.forEach((card) => card.classList.remove("span-full"));
    if (visibleCards.length % 2 === 1) {
      visibleCards[visibleCards.length - 1].classList.add("span-full");
    }



  if (isNotEmpty(data.imageUrl)) {
    profileImage.src = String(data.imageUrl).trim();
    profileImage.classList.remove("hidden");
    avatar.classList.add("hidden");
  } else {
    profileImage.removeAttribute("src");
    profileImage.classList.add("hidden");
    avatar.classList.remove("hidden");
  }

  if (String(data.status || "").toLowerCase() === "lost") {
    statusBadge.textContent = typeof getLang !== "undefined" ? getLang("lostStatus") : "ของสูญหาย / กรุณาช่วยติดต่อ";
    statusBadge.classList.add("lost");
  } else {
    statusBadge.textContent = typeof getLang !== "undefined" ? getLang("normalStatus") : "สถานะปกติ";
    statusBadge.classList.remove("lost");
  }

  const currentId = getIdFromUrl();
  if (currentId && editMiniBtn) {
    const editUrl = `${getBaseUrl()}register.html?id=${encodeURIComponent(currentId)}`;
    editMiniBtn.href = editUrl;
    editMiniBtn.classList.remove("hidden");
    if (editMiniBtn2) {
      editMiniBtn2.href = editUrl;
      editMiniBtn2.classList.remove("hidden");
    }
  }
}

function showError(message) {

  profileCard.classList.remove("hidden");
  applyTemplate("minimal");

  if (hiddenModeView) {
    hiddenModeView.classList.add("hidden");
  }

  profileCard.style.display = "block";
  ownerName.textContent = typeof getLang !== "undefined" ? getLang("notFound") : "ไม่พบข้อมูล";
  avatar.textContent = "!";
  statusBadge.textContent = typeof getLang !== "undefined" ? getLang("errorStatus") : "เกิดข้อผิดพลาด";
  statusBadge.classList.remove("lost");
  noticeBox.textContent = message;
  if (phoneText) phoneText.textContent = "-";
  extraText.textContent = "-";

  if (emailItem) {
    emailItem.style.display = "none";
  }

  callBtn.style.display = "none";
  if (lineBtn) lineBtn.style.display = "none";

  profileImage.removeAttribute("src");
  profileImage.classList.add("hidden");
  avatar.classList.remove("hidden");
}

loadProfile();