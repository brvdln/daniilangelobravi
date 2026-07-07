# Capacità: Screenshot automatico schermo

Data scoperta: 2026-07-06

## Come funziona
Claude può catturare lo schermo del PC tramite PowerShell usando System.Drawing e System.Windows.Forms, salvarlo in una cartella temp, e leggerlo come immagine per vedere cosa c'è sullo schermo.

## Comando PowerShell
```powershell
Add-Type -AssemblyName System.Drawing, System.Windows.Forms
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen([System.Drawing.Point]::Empty, [System.Drawing.Point]::Empty, $bmp.Size)
$path = "C:\Users\DANIIL~1.PC-\AppData\Local\Temp\claude\...\scratchpad\screen.png"
$bmp.Save($path)
$g.Dispose(); $bmp.Dispose()
```
Poi leggere il file con il tool Read per vedere l'immagine.

## Quando usarla
Quando Daniil dice "screen" — catturare lo schermo in automatico senza aspettare che mandi uno screenshot manuale.
