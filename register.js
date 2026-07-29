const imageFileInput = document.getElementById("imageFile");
const profileForm = document.getElementById("profileForm");
const submitBtn = document.getElementById("submitBtn");
const resultBox = document.getElementById("resultBox");
const linkBox = document.getElementById("linkBox");
const profileLinkInput = document.getElementById("profileLink");
const accessCode2Input = document.getElementById("accessCode2");

const accessCard = document.getElementById("accessCard");
const accessIdInput = document.getElementById("accessId");
const accessCodeInput = document.getElementById("accessCode");
const verifyBtn = document.getElementById("verifyBtn");



const fields = {
  id: document.getElementById("id"),
  password2: document.getElementById("password2Hidden"),
  name: document.getElementById("name"),
  tagline: document.getElementById("tagline"),
  phone: document.getElementById("phone"),
  lineId: document.getElementById("lineId"),
  facebook: document.getElementById("facebook"),
  instagram: document.getElementById("instagram"),
  x: document.getElementById("x"),
  wechat: document.getElementById("wechat"),
  whatsapp: document.getElementById("whatsapp"),
  youtube: document.getElementById("youtube"),
  tiktok: document.getElementById("tiktok"),
  email: document.getElementById("email"),
  message: document.getElementById("message"),
  template: document.getElementById("template"),
  imageUrl: document.getElementById("imageUrl"),
  status: document.getElementById("status"),
  editCode: document.getElementById("editCodeHidden"),
  displayMode: document.querySelector('input[name="displayMode"]:checked')
};


let isVerified = false;


function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function generateId(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function ensureIdForNewForm() {
  return;
}




async function loadProfileToForm(idFromVerify) {
  const id = idFromVerify || getIdFromUrl();

  if (!id) {
    showResult("กรุณาระบุรหัสลูกค้า", "error");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("profiles_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      showResult("ไม่พบข้อมูลสำหรับแก้ไข", "error");
      return;
    }

    fields.id.value = data.id || "";
    fields.name.value = data.name || "";
    fields.tagline.value = data.tagline || "";
    fields.phone.value = data.phone || "";
    fields.lineId.value = data.line_id || "";
    fields.email.value = data.email || "";
    fields.message.value = data.message || "";
    fields.template.value = data.template || "minimal";
    fields.imageUrl.value = data.image_url || "";
    fields.status.value = data.status || "normal";
    fields.facebook.value = data.facebook || "";
    fields.instagram.value = data.instagram || "";
    fields.x.value = data.x || "";
    fields.wechat.value = data.wechat || "";
    fields.whatsapp.value = data.whatsapp || "";
    fields.youtube.value = data.youtube || "";
    fields.tiktok.value = data.tiktok || "";


    const selectedDisplayMode = data.display_mode || "show";
    const radio = document.querySelector(`input[name="displayMode"][value="${selectedDisplayMode}"]`);
    if (radio) {
      radio.checked = true;
    }

    profileForm.style.display = "grid";
    if (accessCard) {
      accessCard.style.display = "none";
    }

    showResult(`${typeof getLang !== "undefined" ? getLang("loadSuccess") : "โหลดข้อมูลของ"} ${data.id}`, "success");
    showLinks(data.id);
  } catch (error) {
    console.error(error);
    showResult("เกิดข้อผิดพลาดในการโหลดข้อมูลเดิม", "error");
  }
}


async function verifyAccess(id, editCode, password2) {
  const { data, error } = await supabaseClient.rpc("verify_edit_access", {
    p_id: id,
    p_edit_code: editCode,
    p_password2: password2
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: data === true };
}


verifyBtn.addEventListener("click", async () => {
  const id = accessIdInput.value.trim();
  const editCode = accessCodeInput.value.trim();
  const password2 = accessCode2Input.value.trim();

  if (!id || !editCode || !password2) {
    showResult(typeof getLang !== "undefined" ? getLang("verifyError") : "กรุณากรอกรหัสลูกค้า รหัสผ่าน และรหัสผ่านขั้นที่ 2", "error");
    return;
  }

  verifyBtn.disabled = true;
  verifyBtn.textContent = "กำลังตรวจสอบ...";

  try {
    const result = await verifyAccess(id, editCode, password2);

    if (!result.success) {
      showResult(typeof getLang !== "undefined" ? getLang("errorInvalidId") : "รหัสลูกค้า หรือรหัสผ่านไม่ถูกต้อง", "error");
      return;
    }

    isVerified = true;
    fields.editCode.value = editCode;
    fields.password2.value = password2;
    await loadProfileToForm(id);
  } catch (error) {
    console.error(error);
    showResult("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์", "error");
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.textContent = "ยืนยันเพื่อแก้ไขข้อมูล";
  }
});

async function uploadImageToSupabase(file, id) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("profile-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const { data } = supabaseClient.storage.from("profile-images").getPublicUrl(path);
  return { success: true, imageUrl: data.publicUrl };
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isVerified) {
    showResult("กรุณายืนยันรหัสก่อนแก้ไขข้อมูล", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "กำลังบันทึก...";

    try {
      const selectedFile = imageFileInput.files[0];

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          showResult(typeof getLang !== "undefined" ? getLang("imageSizeError") : "รูปภาพต้องมีขนาดไม่เกิน 5MB", "error");
          submitBtn.disabled = false;
          submitBtn.textContent = "บันทึกข้อมูล";
          return;
        }

        const uploadResult = await uploadImageToSupabase(selectedFile, fields.id.value.trim());
        console.log("uploadResult:", uploadResult);

        if (!uploadResult.success || !uploadResult.imageUrl) {
          showResult(`${typeof getLang !== "undefined" ? getLang("uploadError") : "อัปโหลดรูปไม่สำเร็จ"}: ${uploadResult.message || "Unknown error"}`, "error");
          submitBtn.disabled = false;
          submitBtn.textContent = "บันทึกข้อมูล";
          return;
        }

        fields.imageUrl.value = uploadResult.imageUrl;
        console.log("saved imageUrl:", fields.imageUrl.value);
      }

  
      
    const formData = new FormData(profileForm);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = String(value).trim();
    }

    // ถ้าต้องการเปลี่ยนรหัส
    const newEditCode = document.getElementById("newEditCode").value.trim();
    const newPassword2 = document.getElementById("newPassword2").value.trim();
    const confirmPassword2 = document.getElementById("confirmPassword2").value.trim();

    if (newEditCode || newPassword2 || confirmPassword2) {
      if (!validateNewPassword()) {
        showResult("กรุณากรอกรหัสใหม่ให้ถูกต้องก่อนบันทึก", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "บันทึกข้อมูล";
        return;
      }
    }

    const { data: result, error: saveError } = await supabaseClient.rpc("save_profile", {
      p_id: fields.id.value.trim(),
      p_edit_code: fields.editCode.value,
      p_password2: fields.password2.value,
      p_payload: payload,
      p_new_edit_code: newEditCode || null,
      p_new_password2: newPassword2 || null
    });

    if (saveError || !result || !result.success) {
      const message = saveError ? saveError.message : (result && result.message) || "Unknown error";
      showResult(`${typeof getLang !== "undefined" ? getLang("saveError") : "บันทึกไม่สำเร็จ"}: ${message}`, "error");
      return;
    }

    const savedId = formData.get("id").trim();
    showResult(`${typeof getLang !== "undefined" ? getLang("saveSuccess") : "บันทึกข้อมูลสำเร็จ"} ${savedId}`, "success");
    showLinks(savedId);
  } catch (error) {
    console.error(error);
    showResult("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "บันทึกข้อมูล";
  }
});



function showLinks(id) {
  const profileUrl = `${window.location.origin}/index.html?id=${encodeURIComponent(id)}`;
  profileLinkInput.value = profileUrl;
  linkBox.style.display = "block";
}

function showResult(message, type) {
  resultBox.style.display = "block";
  resultBox.className = `result-box ${type}`;
  resultBox.innerText = message;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("คัดลอกลิงก์แล้ว");
  } catch (error) {
    console.error(error);
    alert("คัดลอกไม่สำเร็จ");
  }
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-copy-target");
    const input = document.getElementById(targetId);
    copyToClipboard(input.value);
  });
});


(function initAccessForm() {
  const urlId = getIdFromUrl();
  if (urlId) {
    accessIdInput.value = urlId;
  }
})();

document.querySelectorAll("[data-go-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-go-target");
    const input = document.getElementById(targetId);
    const url = input.value.trim();

    if (!url) {
      alert("ไม่พบลิงก์");
      return;
    }

    window.open(url, "_blank");
  });
});