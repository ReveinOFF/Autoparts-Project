import React, { useCallback, useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import Toolbar from "./toolbar";
import styles from "./rich.module.css";

const RichText = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const renderElement = useCallback(({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
      case "bulleted-list":
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        );
      case "heading-one":
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        );
      case "list-item":
        return (
          <li style={style} {...attributes}>
            {children}
          </li>
        );
      case "heading-two":
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 style={style} {...attributes}>
            {children}
          </h3>
        );
      case "numbered-list":
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        );
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    console.log(leaf);
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return (
      <span
        {...attributes}
        style={{ color: leaf.color, backgroundColor: leaf.bgColor }}
      >
        {children}
      </span>
    );
  }, []);

  const renderPlaceholder = useCallback((props) => {
    return (
      <span
        {...props.attributes}
        style={{
          pointerEvents: "none",
          opacity: 0.3,
          userSelect: "none",
          position: "absolute",
          left: "10px",
        }}
      >
        {props.children}
      </span>
    );
  }, []);

  const hasText = () => {
    const [firstNode] = Editor.nodes(editor, { match: Text.isText });
    return !!firstNode;
  };

  const handleSave = async () => {};

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        initialValue={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Toolbar className={styles.toolbar} />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className={styles.editor}
          renderPlaceholder={renderPlaceholder}
          placeholder={!hasText() ? "Введіть текст" : ""}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              editor.insertBreak();
            }
          }}
        />
      </Slate>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default RichText;
