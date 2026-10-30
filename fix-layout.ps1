$files = @(
  'src/app/anggaran/layout.tsx',
  'src/app/jemaat/layout.tsx',
  'src/app/jemaat/tambah/layout.tsx',
  'src/app/kas/layout.tsx',
  'src/app/laporan/layout.tsx',
  'src/app/pengguna/layout.tsx',
  'src/app/pengguna/tambah/layout.tsx',
  'src/app/persembahan/layout.tsx',
  'src/app/transaksi/layout.tsx'
)
foreach ($f in $files) {
  $path = "D:/Games/Hades/keuangan/$f"
  if (Test-Path $path) {
    $c = Get-Content $path -Raw
    $c = $c -replace '<div className="flex h-screen bg-gray-50">\s*<div className="w-64 flex-shrink-0">\s*<Sidebar />\s*</div>\s*<main className="flex-1 overflow-y-auto">\s*<div className="p-8">', '<div className="flex h-screen bg-gray-50 overflow-hidden"><Sidebar /><main className="flex-1 min-w-0 w-full overflow-x-hidden overflow-y-auto"><div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 lg:pt-8">'
    $c = $c -replace '<div className="flex h-screen bg-gray-50">\s*<Sidebar />\s*<main className="flex-1 overflow-y-auto">\s*<div className="p-8">', '<div className="flex h-screen bg-gray-50 overflow-hidden"><Sidebar /><main className="flex-1 min-w-0 w-full overflow-x-hidden overflow-y-auto"><div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 lg:pt-8">'
    Set-Content -Path $path -Value $c -NoNewline
  }
}
Write-Host "done"
