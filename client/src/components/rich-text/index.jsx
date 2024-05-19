import React, { useCallback, useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import {
  Editor,
  Range,
  Transforms,
  createEditor,
  Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import Toolbar from "./toolbar";
import styles from "./rich.module.css";

const withLinks = (editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      });

      if (match) {
        Transforms.setNodes(
          editor,
          { type: "paragraph" },
          { match: (n) => SlateElement.isElement(n) && n.type === "link" }
        );
        return;
      }
    }

    deleteBackward(unit);
  };

  return editor;
};

const RichText = ({ value, setValue, onClick }) => {
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback(({ attributes, children, element }) => {
    const style = { textAlign: element.align, justifyContent: element.align };
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
      case "link":
        return (
          <a
            href={element.url}
            style={{ color: "blue", ...style }}
            {...attributes}
          >
            {children}
          </a>
        );
      case "image":
        return (
          <p {...attributes} style={{ display: "flex", ...style }}>
            <img src={element.url} alt="img" />
          </p>
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
        style={{
          color: leaf.color,
          backgroundColor: leaf.bgColor,
          fontSize: `${leaf.fs}px`,
          marginLeft: leaf.ml,
          marginRight: leaf.mr,
          marginTop: leaf.mt,
          marginBottom: leaf.mb,
        }}
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

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        initialValue={[
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]}
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
      <button onClick={onClick} className={styles.btn_save}>
        Зберегти
      </button>
    </div>
  );
};

export default RichText;
