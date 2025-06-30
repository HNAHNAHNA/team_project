import type { JSX } from "react";
export default function PublicOnlyRoute({ children }: {
    children: JSX.Element;
}): import("react/jsx-runtime").JSX.Element;
