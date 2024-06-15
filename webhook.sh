# Slack Webhook URL

send_slack_message() {
    local slack_url="$1"
    local status="$2"
    local current_time=$(TZ=Asia/Seoul date +"%Y-%m-%d %H:%M:%S")
    local message="배포가 $status 하였습니다. 🥳 - 현재 시간: $current_time"
    curl -X POST --data-urlencode "payload={\"text\": \"$message\", \"icon_emoji\": \":earth_asia:\"}" $slack_url
}
send_slack_message $1 $2 
