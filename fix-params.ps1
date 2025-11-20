$files = Get-ChildItem -Path "src/app/api" -Recurse -Filter "*.ts"
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) { continue }
    
    $originalContent = $content
    
    # Find destructured params
    $pattern = 'const\s+\{\s*([^}]+)\s*\}\s*=\s*await\s+params'
    $matches = [regex]::Matches($content, $pattern)
    
    if ($matches.Count -eq 0) { continue }
    
    foreach ($match in $matches) {
        $vars = $match.Groups[1].Value -split ',' | ForEach-Object { $_.Trim() }
        
        foreach ($var in $vars) {
            if ($var -match ':') {
                $parts = $var -split ':'
                $paramName = $parts[0].Trim()
                $localName = $parts[1].Trim()
            } else {
                $paramName = $var.Trim()
                $localName = $var.Trim()
            }
            
            # Replace params.paramName with localName
            $replacePattern = "\bparams\.$paramName\b"
            $content = $content -replace $replacePattern, $localName
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
        $fixedCount++
    }
}

Write-Host "`nTotal files fixed: $fixedCount"
