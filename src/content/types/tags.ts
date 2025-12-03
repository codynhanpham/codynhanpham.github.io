export enum ProgrammingTags {
    'Svelte',
    'SvelteKit',
    'Tauri',

    'HTML',
    'CSS',
    'TailwindCSS',
    
    'TypeScript', 'TS',
    'JavaScript', 'JS',
    'NodeJS',
    'Bun',

    'WebAssembly', 'WASM',
    'MATLAB',
    'Python',
    'R',
    'Julia',
    'Rust',
    'C',
    'C++',
    'C#',
}

export enum CategoryTags {
    'Bioinformatics',
    'Biology',
    'Chemistry',
    'Music',
    'Neuroscience',
    'Personal',
    'Programming',
    'Psychology',
    'Research',
    'Science',
    'WebDev',
}



// A combination of all Tags above
export type Tags =  
    | ProgrammingTags
    | CategoryTags
;