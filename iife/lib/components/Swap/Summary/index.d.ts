/// <reference types="react" />
import Summary from './Summary';
export default Summary;
interface SummaryDialogProps {
    onConfirm: () => void;
}
export declare function SummaryDialog({ onConfirm }: SummaryDialogProps): JSX.Element | null;
