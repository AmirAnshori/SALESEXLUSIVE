# SALESEXLUSIVE

Dashboard JavaScript penjualan untuk GitHub Pages. Kode publik ini tidak menyertakan transaksi, daftar toko/sales, atau snapshot spreadsheet privat.

## Fitur
1. Filter Area → Nama Sales → Nama Toko menggunakan select option dari master toko.
2. Tren dan tabel sell out DPP bulanan, qty net, toko bertransaksi, SKU aktif.
3. Top 15 SKU berdasarkan qty net untuk bulan terpilih dan dua bulan sebelumnya.
4. Analisis per toko/SKU: penurunan qty minimal 20%, jeda order minimal 30 hari, saran cek stok dan repeat order.
5. Ekspor ranking CSV, ringkasan kualitas data, serta indikator bulan parsial.

## Memasukkan data
Buka Sumber data, lalu pilih kedua CSV lokal hasil ekspor dua tab spreadsheet. Data diproses hanya di browser, tidak diunggah ke GitHub atau server. Data lokal tidak disimpan setelah halaman ditutup; impor lagi bila dibuka ulang.

Alternatif: masukkan dua URL Google Sheets yang sudah dipublikasikan sebagai CSV. Mode ini hanya untuk data yang boleh diakses publik. Form menyimpan URL di browser, bukan untuk seluruh tim. Isi `site/config.js` jika URL boleh dibagikan ke semua pengunjung. Jangan menaruh password, token, atau service account di kode. Koneksi ke spreadsheet privat memerlukan backend atau autentikasi tambahan; versi ini tidak menyediakan login.

Sumber dibaca saat halaman dibuka dan ketika menekan Perbarui data. Google dapat memiliki jeda cache/publikasi. Tidak ada sinkronisasi saat halaman tertutup.

## Format sumber
CSV koma, header pertama, urutan kolom asli:

**DB ALL STORE**: Nama Distri, Nama Sales, Nama Toko, GRADE, STATUS*, FIRST ORDER, LAST ORDER, REKOMENDASI, Key, Area.

**RAWDATA SO QTY📦**: Tanggal, Week, Nama Distributor, Nama Toko Distributor, Nama Toko, Grade, Code SKU Distributor, Nama SKU Distributor, Jumlah Qty, Value, Value DPP, Code SKU, Nama SKU, Nama Distributor Clean, Nama Toko X Distri, Category, Area, Nama Sales.

Tanggal memakai YYYY-MM-DD atau DD/MM/YYYY. Ubah format tanggal di Sheets sebelum ekspor bila perlu. Header dan urutan kolom diperiksa.

## Aturan perhitungan
- Aturan DPP mengikuti format sumber TEST DATA PROJECT: angka numerik atau teks angka tanpa pemisah ribuan seperti `25.225` dan `845` memiliki satuan ribuan, dikalikan 1.000. Teks US `264,864.86` sudah rupiah penuh, tidak dikalikan lagi. Jangan memasukkan nilai rupiah penuh tanpa pemisah ke format sumber ini tanpa menyesuaikan parser.
- Header tersisip, error nilai, tanggal masa depan, toko tak cocok/ambigu, dan DPP per unit >Rp1 juta dikarantina seluruh baris. Total KPI tidak mencakup baris tersebut. Lihat Kualitas data.
- Join toko dengan distributor bersih + nama standar, fallback nama distributor toko bila nama standar kosong, lalu nama toko unik. Nama ambigu tidak ditebak. Duplikat identitas master memakai baris pertama.
- Kode SKU standar, lalu kode distributor, lalu nama SKU menjadi identitas produk. Variasi tanpa mapping kode bisa terpisah.
- Retur mengurangi qty dan DPP. Order terakhir menggunakan qty positif.
- Ranking mencakup bulan terpilih dan dua bulan sebelumnya, termasuk bulan yang tidak memiliki order.
- Penurunan qty membandingkan dua bulan lengkap sebelum bulan analisis. Bulan parsial tidak dibandingkan langsung dengan bulan penuh pada KPI.
- Hari tanpa order dihitung sampai tanggal data terakhir atau akhir bulan terpilih, mana yang lebih awal. Tidak mengekstrapolasi ke tanggal hari ini.
- Alert merupakan indikasi, bukan bukti stok kosong. Validasi kondisi toko saat kunjungan.

## Hosting
Workflow `.github/workflows/pages.yml` mengunggah folder `site` ke GitHub Pages. Jika aktivasi otomatis tidak diizinkan, pilih **Settings → Pages → Build and deployment → Source: GitHub Actions**, lalu rerun workflow. Semua data yang ditempatkan di folder `site` akan menjadi publik.

Lokal: `python -m http.server 8080 --directory site`, lalu buka http://localhost:8080. Tidak memerlukan npm install.

## Validasi
Parser DPP, CSV berkutip, batas tahun dan rekonsiliasi baris telah diuji. Filter bertingkat dan ranking toko telah diuji di browser dengan snapshot privat. Koneksi live memerlukan URL CSV yang bisa diakses.

Referensi: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site dan https://support.google.com/docs/answer/183965.
