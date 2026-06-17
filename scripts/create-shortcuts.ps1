$desktopPath = [Environment]::GetFolderPath("Desktop")
$programsPath = [Environment]::GetFolderPath("Programs")
$targetPath = "C:\Users\54258672807\Documents\Antigravity 2604\05 - Lista de tarefas\release\Lista de Tarefas-win32-x64\Lista de Tarefas.exe"
$workingDir = "C:\Users\54258672807\Documents\Antigravity 2604\05 - Lista de tarefas\release\Lista de Tarefas-win32-x64"

Write-Host "Criando atalhos para o aplicativo..."

$WshShell = New-Object -ComObject WScript.Shell

# 1. Atalho na Área de Trabalho
if (Test-Path $desktopPath) {
    $Shortcut = $WshShell.CreateShortcut("$desktopPath\Lista de Tarefas.lnk")
    $Shortcut.TargetPath = $targetPath
    $Shortcut.WorkingDirectory = $workingDir
    $Shortcut.Save()
    Write-Host "Atalho criado na Área de Trabalho com sucesso!"
}

# 2. Atalho no Menu Iniciar
if (Test-Path $programsPath) {
    $Shortcut = $WshShell.CreateShortcut("$programsPath\Lista de Tarefas.lnk")
    $Shortcut.TargetPath = $targetPath
    $Shortcut.WorkingDirectory = $workingDir
    $Shortcut.Save()
    Write-Host "Atalho criado no Menu Iniciar com sucesso!"
}
