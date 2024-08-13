"use client";

import dynamic from "next/dynamic";

import Editor from "@uiw/react-md-editor";
//This component is being used to weite questiona nd its formate is being shown on right side 
// for more information, see https://mdxeditor.dev/editor/docs/getting-started

// This is the only place InitializedMDXEditor is imported directly.
const RTE = dynamic(
    () =>
        import("@uiw/react-md-editor").then(mod => {
            return mod.default;
        }),
    { ssr: false }
);

export const MarkdownPreview = Editor.Markdown;

export default RTE;