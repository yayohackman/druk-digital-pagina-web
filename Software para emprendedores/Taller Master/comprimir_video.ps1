<#
Comprime "Manual de uso inicial Final.mp4" a un tamaño cercano al video
anterior (~7MB) para poder subirlo a GitHub y desplegar en Vercel.

CÓMO USARLO:
1) Verifica que tengas ffmpeg instalado. Abre PowerShell y escribe:
      ffmpeg -version
   Si no lo reconoce, instálalo con:
      winget install ffmpeg
   (o descárgalo de https://www.gyan.dev/ffmpeg/builds/ y agrega la
    carpeta "bin" al PATH de Windows)

2) Este script ya está guardado en la misma carpeta que el video
   ("Software para emprendedores\Taller Master").

3) Clic derecho sobre "comprimir_video.ps1" > "Ejecutar con PowerShell"
   (si Windows bloquea el script, abre PowerShell en esa carpeta y
    ejecuta primero:  Set-ExecutionPolicy -Scope Process Bypass
    y luego:  .\comprimir_video.ps1)

4) Espera unos minutos (hace 2 pasadas de compresión).

5) El resultado queda como
   "Manual de uso inicial Final - web.mp4" en la misma carpeta,
   listo para reemplazar/subir junto al resto de videos del sitio.
#>

$ErrorActionPreference = "Stop"

$carpeta   = $PSScriptRoot
$entrada   = Join-Path $carpeta "Manual de uso inicial Final.mp4"
$salida    = Join-Path $carpeta "Manual de uso inicial Final - web.mp4"
$targetMB  = 6.5      # un poco menos de 7MB para dejar margen
$audioKbps = 96        # suficiente para voz/tutorial

if (-not (Test-Path $entrada)) {
    Write-Host "No se encontro el archivo: $entrada" -ForegroundColor Red
    exit 1
}

$ffmpeg  = Get-Command ffmpeg  -ErrorAction SilentlyContinue
$ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue
if (-not $ffmpeg -or -not $ffprobe) {
    Write-Host "ffmpeg no esta instalado." -ForegroundColor Yellow
    Write-Host "Instalalo con:  winget install ffmpeg" -ForegroundColor Yellow
    Write-Host "o descargalo de https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Analizando el video..." -ForegroundColor Cyan
$duracion = & ffprobe -v error -show_entries format=duration -of csv=p=0 $entrada
$duracion = [double]$duracion

$totalKbps = ($targetMB * 8192) / $duracion
$videoKbps = [math]::Round($totalKbps - $audioKbps)

if ($videoKbps -lt 150) {
    Write-Host ("Aviso: el video dura {0:N1} min. A {1}MB el bitrate de video queda muy bajo ({2} kbps) y se vera con poca calidad." -f ($duracion/60), $targetMB, $videoKbps) -ForegroundColor Yellow
    Write-Host "Si la calidad no te convence, considera recortar el video o subirlo a YouTube/Vimeo y solo enlazarlo desde la pagina." -ForegroundColor Yellow
}

Write-Host ("Duracion: {0:N1}s | Bitrate de video objetivo: {1} kbps" -f $duracion, $videoKbps) -ForegroundColor Cyan

$logPrefix = Join-Path $carpeta "ffmpeg2pass"

Write-Host "Pasada 1 de 2..." -ForegroundColor Cyan
& ffmpeg -y -i $entrada -c:v libx264 -preset slow -b:v "${videoKbps}k" -pass 1 -passlogfile $logPrefix -vf "scale='min(1280,iw)':-2" -an -f mp4 NUL

Write-Host "Pasada 2 de 2..." -ForegroundColor Cyan
& ffmpeg -y -i $entrada -c:v libx264 -preset slow -b:v "${videoKbps}k" -pass 2 -passlogfile $logPrefix -vf "scale='min(1280,iw)':-2" -c:a aac -b:a "${audioKbps}k" -movflags +faststart $salida

Remove-Item "$logPrefix*" -ErrorAction SilentlyContinue

$tamañoFinal = (Get-Item $salida).Length / 1MB
Write-Host ""
Write-Host "Listo. Archivo generado: $salida" -ForegroundColor Green
Write-Host ("Tamano final: {0:N2} MB" -f $tamañoFinal) -ForegroundColor Green
