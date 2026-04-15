const { createApp, ref } = Vue;

createApp({
  setup() {
    const modelUrl = ref(null);
    const sketchfabUrl = ref("");
    const customMarker = ref(false);
    const customMarkerUrl = ref("");
    const customMarkerPreset = ref("custom");
    const arjsConfig = ref("trackingMethod: best;");

    const handleModelUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        modelUrl.value = URL.createObjectURL(file);
      }
    };

    const loadSketchfabModel = () => {
      if (sketchfabUrl.value.includes("sketchfab.com")) {
        const modelId = sketchfabUrl.value.split("/models/")[1].split("/")[0];
        modelUrl.value = `https://api.sketchfab.com/v3/models/${modelId}/download`;
      } else {
        alert("Veuillez entrer un lien Sketchfab valide.");
      }
    };

    const handleMarkerUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        customMarker.value = true;
        customMarkerUrl.value = URL.createObjectURL(file);
      }
    };

    const startAR = () => {
      if (!modelUrl.value) {
        alert("Veuillez charger un modèle 3D avant de lancer la RA.");
        return;
      }
      alert("Pointez votre caméra vers le marqueur (Hiro ou personnalisé).");
    };

    const exportProject = () => {
      if (!modelUrl.value) {
        alert("Veuillez charger un modèle 3D avant d'exporter.");
        return;
      }

      const markerCode = customMarker.value
        ? `<a-marker type="pattern" url="${customMarkerUrl.value}">
            <a-entity gltf-model="${modelUrl.value}" scale="0.5 0.5 0.5"></a-entity>
          </a-marker>`
        : `<a-marker preset="hiro">
            <a-entity gltf-model="${modelUrl.value}" scale="0.5 0.5 0.5"></a-entity>
          </a-marker>`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
            <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
          </head>
          <body style="margin: 0; overflow: hidden;">
            <a-scene embedded arjs="trackingMethod: best;">
              ${markerCode}
              <a-entity camera></a-entity>
            </a-scene>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "projet-ra.html";
      a.click();
    };

    return {
      modelUrl,
      sketchfabUrl,
      customMarker,
      customMarkerUrl,
      customMarkerPreset,
      arjsConfig,
      handleModelUpload,
      loadSketchfabModel,
      handleMarkerUpload,
      startAR,
      exportProject,
    };
  },
}).mount("#app");