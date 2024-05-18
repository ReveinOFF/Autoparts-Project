import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import axios from "axios";
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

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const result = await axios.get("/load");
  //       setValue(JSON.parse(result.data));
  //     };

  //     fetchData();
  //   }, []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
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
        Введіть текст
      </span>
    );
  }, []);

  const handleSave = async () => {
    const content = JSON.stringify(value);
    console.log(content);
    // await axios.post("/save", { content });
  };

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
          placeholder="Введіть текст"
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

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none",
        textAlign: props.leaf.textRight
          ? "end"
          : props.leaf.textCenter
          ? "center"
          : "start",
      }}
    >
      {props.children}
    </span>
  );
};

export default RichText;
