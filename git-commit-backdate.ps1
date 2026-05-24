param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [string]$Date = "2026-05-23T14:30:00"
)

$env:GIT_AUTHOR_DATE=$Date
$env:GIT_COMMITTER_DATE=$Date

git add .
git commit -m $Message

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Commit created successfully with date: $Date" -ForegroundColor Green
