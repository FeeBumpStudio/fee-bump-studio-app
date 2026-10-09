// Mermaid diagram initialization for MkDocs Material

// Configure mermaid globally
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    themeVariables: {
      primaryColor: '#6750a4',
      primaryTextColor: '#fff',
      primaryBorderColor: '#6750a4',
      lineColor: '#6750a4',
      secondaryColor: '#eaddff',
      tertiaryColor: '#f3edf7',
      background: 'transparent',
      mainBkg: 'transparent',
      secondBkg: 'transparent',
      tertiaryBkg: 'transparent',
      textColor: '#1d1b20',
      nodeBorder: '#6750a4',
      clusterBorder: '#6750a4',
      defaultLinkColor: '#6750a4',
      titleColor: '#1d1b20',
      edgeLabelBackground: '#f3edf7',
      actorBorder: '#6750a4',
      actorTextColor: '#1d1b20',
      actorBkg: '#eaddff',
      useMaxWidth: true,
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      mirrorActors: true,
      bottomMarginAdj: 1,
      useMaxWidth: true,
    },
    gantt: {
      useMaxWidth: true,
    },
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
  });
}

// Re-render mermaid on navigation (for Material's instant loading)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof mermaid !== 'undefined') {
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }
});

// Handle instant navigation (Material for MkDocs)
if (typeof document$ !== 'undefined') {
  document$.subscribe(() => {
    if (typeof mermaid !== 'undefined') {
      mermaid.init(undefined, document.querySelectorAll('.mermaid:not([data-processed])'));
    }
  });
}

// Fallback for standard navigation
document.addEventListener('nav', () => {
  if (typeof mermaid !== 'undefined') {
    mermaid.init(undefined, document.querySelectorAll('.mermaid:not([data-processed])'));
  }
});