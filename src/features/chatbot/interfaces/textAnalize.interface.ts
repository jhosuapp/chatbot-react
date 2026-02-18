export interface TextAnalizeResponse {
    video_id:         AnalysisIds;
    confidence:  number;
    reasoning:   string;
    reason_code: string;
}

export type AnalysisIds = 
    'A1_BIENVENIDA' | 
    'A2_LIMITES' |
    'A3_INVITACION' |
    'B1_VPH_DEFINICION' |
    'B2_VPH_COMUN' |
    'B3_VPH_TIPOS' |
    'B4_VPH_SALUD' |
    'B5_VPH_PREVENCION' |
    'B6_VPH_EDUCACION' |
    'C1_VACUNA_DEFINICION' |
    'C2_VACUNA_PREVENCION' |
    'C3_VACUNA_VPH' |
    'C4_VACUNA_SEGURIDAD' |
    'C5_VACUNA_PROGRAMAS' |
    'C6_VACUNA_REDIRECCION' |
    'D1_NO_DIAGNOSTICO' |
    'D2_NO_TRATAMIENTO' |
    'D3_FUERA_ALCANCE' |
    'D4_NO_ENTENDI' |
    'D6_CIERRE' |
    'C4_VACUNA_SEGURIDAD';