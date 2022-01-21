import { ReactNode } from 'react';
import styled from './styled';
import { Colors, Theme } from './theme';
export type { Color, Colors, Theme } from './theme';
export default styled;
export * from './dynamic';
export * from './layer';
export * from './styled';
export * as ThemedText from './type';
export declare const lightTheme: Colors;
export declare const darkTheme: Colors;
export declare const defaultTheme: {
    accent: string;
    container: string;
    module: string;
    interactive: string;
    outline: string;
    dialog: string;
    primary: string;
    secondary: string;
    hint: string;
    onInteractive: string;
    active: string;
    success: string;
    warning: string;
    error: string;
    currentColor: "currentColor";
    borderRadius: number;
    fontFamily: string;
    fontFamilyVariable: string;
    fontFamilyCode: string;
    tokenColorExtraction: boolean;
};
export declare function useSystemTheme(): Colors;
interface ThemeProviderProps {
    theme?: Theme;
    children: ReactNode;
}
export declare function ThemeProvider({ theme, children }: ThemeProviderProps): JSX.Element;