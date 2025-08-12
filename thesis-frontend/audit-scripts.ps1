# Frontend Audit & Testing Script for Thesis Project
# Run this script to perform comprehensive frontend auditing

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "    Frontend Software Audit & Testing Suite    " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Code Quality & Linting
Write-Host "`n[1] Running ESLint for code quality..." -ForegroundColor Yellow
npm run lint

# 2. Build Analysis
Write-Host "`n[2] Running build with bundle analysis..." -ForegroundColor Yellow
npm run build:analyze

# 3. Dependency Audit
Write-Host "`n[3] Checking for security vulnerabilities..." -ForegroundColor Yellow
npm audit

# 4. Outdated Packages Check
Write-Host "`n[4] Checking for outdated packages..." -ForegroundColor Yellow
npm outdated

# 5. Build Production Version
Write-Host "`n[5] Building production version..." -ForegroundColor Yellow
npm run build:production

# 6. Check Build Size
Write-Host "`n[6] Analyzing build size..." -ForegroundColor Yellow
$distPath = ".\dist"
if (Test-Path $distPath) {
    $totalSize = (Get-ChildItem $distPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Total build size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Green
    
    # Show individual file sizes
    Get-ChildItem $distPath -Recurse -File | 
        Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB, 2)}} |
        Sort-Object "Size(KB)" -Descending |
        Select-Object -First 10 |
        Format-Table -AutoSize
}

# 7. Lighthouse CI (if installed)
Write-Host "`n[7] Running Lighthouse CI..." -ForegroundColor Yellow
$lighthouseInstalled = npm list -g @lhci/cli 2>$null
if ($lighthouseInstalled) {
    # Start preview server in background
    $previewJob = Start-Job -ScriptBlock { npm run preview }
    Start-Sleep -Seconds 5
    
    # Run Lighthouse
    npx lhci autorun --collect.url="http://localhost:4173" --upload.target=temporary-public-storage
    
    # Stop preview server
    Stop-Job $previewJob
    Remove-Job $previewJob
} else {
    Write-Host "Lighthouse CI not installed. Install with: npm install -g @lhci/cli" -ForegroundColor Red
}

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "    Audit Complete! Check results above.       " -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
