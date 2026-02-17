export interface TextAnalizeResponse {
    video_code:       string;
    video_title:      string;
    video_url:        string;
    category:         'default' | 'que_es';
    confidence:       number;
    analysis_details: AnalysisDetails;
}

export interface AnalysisDetails {
    original_text:      string;
    clean_text:         string;
    predicted_category: string;
    confidence:         number;
    category_scores:    CategoryScores;
    has_vph_reference:  boolean;
    is_non_vph:         boolean;
}

export interface CategoryScores {
    que_es:      number;
    sintomas:    number;
    prevencion:  number;
    tratamiento: number;
    cuidados:    number;
}
