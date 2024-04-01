// navigator.serviceWorker.register("dummy-sw.js");

// 检测浏览器是否支持SW;
if ("serviceWorker" in navigator) {
  // 注册第一个 Service Worker
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker 1 注册成功:", registration);
    })
    .catch(function (error) {
      console.error("Service Worker 1 注册失败:", error);
    });

  // 注册第二个 Service Worker
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker 2 注册成功:", registration);
    })
    .catch(function (error) {
      console.error("Service Worker 2 注册失败:", error);
    });

  // 以此类推，注册更多的 Service Worker
} else {
  console.warn("当前浏览器不支持 Service Worker.");
}

window.addEventListener("DOMContentLoaded", async (event) => {
  if ("BeforeInstallPromptEvent" in window) {
    showResult("⏳ BeforeInstallPromptEvent supported but not fired yet");
  } else {
    showResult("❌ BeforeInstallPromptEvent NOT supported");
  }
  document.querySelector("#install").addEventListener("click", installApp);
});

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  // e.preventDefault();
  // Save the event because you’ll need to trigger it later.
  deferredPrompt = e;
  console.log(deferredPrompt);
  // Show your customized install prompt for your PWA
  document.querySelector("#install").style.display = "block";
  showResult("✅ BeforeInstallPromptEvent fired", true);
});

window.addEventListener("appinstalled", (e) => {
  showResult("✅ AppInstalled fired", true);
});

async function installApp() {
  console.log("???");
  if (deferredPrompt) {
    deferredPrompt.prompt();
    showResult("🆗 Installation Dialog opened");
    // Find out whether the user confirmed the installation or not
    const { outcome } = await deferredPrompt.userChoice;
    // The deferredPrompt can only be used once.
    deferredPrompt = null;
    // Act on the user's choice
    if (outcome === "accepted") {
      showResult("😀 User accepted the install prompt.", true);
    } else if (outcome === "dismissed") {
      showResult("😟 User dismissed the install prompt");
    }
    // We hide the install button
    document.querySelector("#install").style.display = "none";
  }
}

function showResult(text, append = false) {
  if (append) {
    document.querySelector("output").innerHTML += "<br>" + text;
  } else {
    document.querySelector("output").innerHTML = text;
  }
}
