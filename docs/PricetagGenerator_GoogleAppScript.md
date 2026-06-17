// ================= KONFIGURASI UTAMA =================
const TEMPLATE_SLIDE_ID = "1X8W88EABhlDxMOHhpUqKr_YWgyiIXxSgJxAJXwAs3R0";
const FOLDER_OUTPUT_ID = "1_hDgm1HggN9ub0pI3yZ4llDmRYpiOnQ5";
// =====================================================

function doPost(e) {
try {
// 1. Tangkap JSON dari Laravel
const data = JSON.parse(e.postData.contents);

    // Ekspektasi data: { user: "Anjas Kurniawan", category: "Audio", produk: "JETE TWS T10", varian: "Black", hargaNormal: 399000, hargaPotongan: 199000, fileName: "JETE-T10-BLK.jpg" }

    const rootFolder = DriveApp.getFolderById(FOLDER_OUTPUT_ID);
    const templateFile = DriveApp.getFileById(TEMPLATE_SLIDE_ID);

    // 2. Buat Struktur Folder: Root -> Nama User -> Kategori
    const userFolder = getOrCreateFolder(rootFolder, data.user);
    const targetFolder = getOrCreateFolder(userFolder, data.category);

    // 3. Format Rupiah
    const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

    // 4. Buat Copy Slide Sementara
    const fileCopy = templateFile.makeCopy("TEMP_" + data.fileName, targetFolder);
    const slideId = fileCopy.getId();
    const slideDoc = SlidesApp.openById(slideId);
    const firstSlide = slideDoc.getSlides()[0];

    // 5. Replace Teks
    firstSlide.replaceAllText("{{Produk}}", data.produk);
    firstSlide.replaceAllText("{{Varian}}", data.varian);
    firstSlide.replaceAllText("{{HargaNormal}}", formatter.format(data.hargaNormal));
    firstSlide.replaceAllText("{{HargaPotongan}}", formatter.format(data.hargaPotongan));

    slideDoc.saveAndClose();
    Utilities.sleep(2000); // Jeda agar Google server sinkronisasi

    // 6. Tarik Gambar (Retry System)
    let exportType = data.fileName.toLowerCase().endsWith(".png") ? "png" : "jpeg";
    let url = "https://docs.google.com/presentation/d/" + slideId + "/export/" + exportType;
    let token = ScriptApp.getOAuthToken();

    let imageBlob = null;
    let isExportSuccess = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        let response = UrlFetchApp.fetch(url, {
            headers: { 'Authorization': 'Bearer ' + token },
            muteHttpExceptions: true
        });
        if (response.getResponseCode() === 200) {
          imageBlob = response.getBlob().setName(data.fileName);
          isExportSuccess = true;
          break;
        } else {
          Utilities.sleep(3000);
        }
      } catch (err) {
        Utilities.sleep(3000);
      }
    }

    // 7. Simpan & Timpa File Lama
    let viewLink = "";
    let downloadLink = "";

    if (isExportSuccess) {
      let existingFiles = targetFolder.getFilesByName(data.fileName);
      while (existingFiles.hasNext()) {
        existingFiles.next().setTrashed(true);
      }

      let finalFile = targetFolder.createFile(imageBlob);

      // Pakai try-catch untuk jaga-jaga kalau akses 'Anyone' diblokir admin Workspace
      try {
        finalFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch(e) {
        // Abaikan jika gagal sharing
      }

      viewLink = finalFile.getUrl(); // Link untuk melihat (paling stabil)
      downloadLink = finalFile.getDownloadUrl() || viewLink; // Link download langsung
    }

    // 8. Hapus file template sementara
    fileCopy.setTrashed(true);

    // 9. Kembalikan Response ke Laravel
    if (isExportSuccess) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        file_url: viewLink,
        download_url: downloadLink
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Gagal mengekspor gambar setelah 3x percobaan.");
    }

    // 8. Hapus file template sementara
    fileCopy.setTrashed(true);

    // 9. Kembalikan Response ke Laravel
    if (isExportSuccess) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', file_url: finalLink }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Gagal mengekspor gambar setelah 3x percobaan.");
    }

} catch (error) {
return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
.setMimeType(ContentService.MimeType.JSON);
}
}

function getOrCreateFolder(parentFolder, folderName) {
const safeFolderName = folderName.replace(/[\\/:*?"<>|]/g, "\_");
const folders = parentFolder.getFoldersByName(safeFolderName);
if (folders.hasNext()) {
return folders.next();
} else {
return parentFolder.createFolder(safeFolderName);
}
}
