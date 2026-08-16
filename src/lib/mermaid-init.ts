import mermaid from "mermaid";

/**
 * High-contrast mermaid theme for RepoMind
 */
export const initMermaid = () => {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        suppressErrorRendering: true,
        themeVariables: {
            primaryColor: '#ffffff',
            primaryTextColor: '#111111',
            primaryBorderColor: '#111111',
            lineColor: '#111111',
            secondaryColor: '#f5f5f5',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#FFFFFF',
            secondBkg: '#f5f5f5',
            border1: '#111111',
            border2: '#737373',
            arrowheadColor: '#111111',
            fontFamily: 'var(--font-dm), ui-sans-serif, sans-serif',
        }
    });
};
