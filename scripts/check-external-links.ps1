$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$links = (Get-Content -Raw -LiteralPath (Join-Path $root 'reports/link-check.json') | ConvertFrom-Json).externalURLs
$results = $links | ForEach-Object -Parallel {
  $uri = $_
  try {
    $r = Invoke-WebRequest -Uri $uri -Method Head -SkipHttpErrorCheck -MaximumRedirection 10 -TimeoutSec 20
    if ($r.StatusCode -eq 405) { $r = Invoke-WebRequest -Uri $uri -SkipHttpErrorCheck -MaximumRedirection 10 -TimeoutSec 20 }
    [PSCustomObject]@{url=$uri; status=[int]$r.StatusCode; destination=$r.BaseResponse.RequestMessage.RequestUri.AbsoluteUri}
  } catch { [PSCustomObject]@{url=$uri; status=0; error=$_.Exception.Message} }
} -ThrottleLimit 6
$results | Sort-Object url | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 -LiteralPath (Join-Path $root 'reports/external-links.json')
$results | Group-Object status | Select-Object Name,Count
$results | Where-Object {$_.status -ge 400 -or $_.status -eq 0} | Select-Object url,status,error | ConvertTo-Json -Depth 4
