import { TargetAndTransition, VariantLabels } from "framer-motion";

export type PartialMotionVariants = {
    initial?: TargetAndTransition | VariantLabels | boolean;
    animate?: TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
};