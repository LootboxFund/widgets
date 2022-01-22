/// <reference types="react" />
import { SwapRoute } from './state';
export interface SwapWidgetProps {
    initialRoute?: SwapRoute;
}
declare const SwapWidget: (props: SwapWidgetProps) => JSX.Element;
export default SwapWidget;
