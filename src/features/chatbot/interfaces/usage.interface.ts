export interface UsageBody {
    usage_time_seconds: number,
    session_id: string,
    additional_data: {
        page: string
    }
}