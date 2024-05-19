import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import boldImg from "../../assets/images/admin/rich/bold.svg";
import italicImg from "../../assets/images/admin/rich/italic.svg";
import underlineImg from "../../assets/images/admin/rich/underline.svg";
import textLeftImg from "../../assets/images/admin/rich/align-left.svg";
import textCenterImg from "../../assets/images/admin/rich/align-center.svg";
import textRightImg from "../../assets/images/admin/rich/align-right.svg";
import h1 from "../../assets/images/admin/rich/h1.svg";
import h2 from "../../assets/images/admin/rich/h2.svg";
import h3 from "../../assets/images/admin/rich/h3.svg";
import ol from "../../assets/images/admin/rich/list1.svg";
import ul from "../../assets/images/admin/rich/list2.svg";
import bg from "../../assets/images/admin/rich/bg.svg";
import color from "../../assets/images/admin/rich/text-color.svg";
import image from "../../assets/images/admin/rich/image.svg";
import linkimg from "../../assets/images/admin/rich/link.svg";
import fsimg from "../../assets/images/admin/rich/font_size.svg";
import marginimg from "../../assets/images/admin/rich/margin.svg";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const ToolbarButton = ({
  style,
  format,
  icon,
  altText,
  currentAlign,
  setAlign,
  blockType,
  setBlockType,
  listActive,
  setListActive,
}) => {
  const colorRef = useRef();
  const bgRef = useRef();
  const editor = useSlate();
  const [isActive, setIsActive] = useState(false);

  const isMarkActive = useCallback(() => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }, [editor, format]);

  const isBlockActive = useCallback(() => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  }, [editor, format]);

  useEffect(() => {
    if (["left", "center", "right"].includes(format)) {
      setIsActive(currentAlign === format);
    } else if (LIST_TYPES.includes(format)) {
      setIsActive(listActive === format);
    } else if (
      ["heading-one", "heading-two", "heading-three", "paragraph"].includes(
        format
      )
    ) {
      setIsActive(blockType === format);
    } else {
      setIsActive(isMarkActive());
    }
  }, [
    editor.selection,
    isMarkActive,
    isBlockActive,
    format,
    currentAlign,
    blockType,
    listActive,
  ]);

  const toggleMark = (event) => {
    event.preventDefault();
    const isActive1 = isMarkActive();

    if (isActive1) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }

    setIsActive(!isActive1);
  };

  const toggleMarkVal = (event, value) => {
    event.preventDefault();
    Editor.addMark(editor, format, value);
  };

  const toggleAlign = (event) => {
    event.preventDefault();
    const isActive1 = currentAlign === format;

    // Удаление всех выравниваний
    const alignFormats = ["left", "center", "right"];
    alignFormats.forEach((alignFormat) => {
      Transforms.setNodes(
        editor,
        { align: null },
        { match: (n) => SlateElement.isElement(n) && n.align === alignFormat }
      );
    });

    // Установка нового выравнивания, если оно не активно
    if (!isActive1) {
      Transforms.setNodes(
        editor,
        { align: format },
        { match: (n) => SlateElement.isElement(n) }
      );
      setAlign(format);
    } else {
      Transforms.setNodes(
        editor,
        { align: null },
        { match: (n) => SlateElement.isElement(n) }
      );
      setAlign(null);
    }
  };

  const toggleList = (event) => {
    event.preventDefault();
    const isActive1 = isBlockActive();
    const blockFormats = ["bulleted-list", "numbered-list"];
    const isList = blockFormats.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) => blockFormats.includes(n.type),
      split: true,
    });

    Transforms.setNodes(editor, {
      type: isActive1 ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive1 && isList) {
      setListActive(format);
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    } else {
      setListActive(null);
    }
  };

  const toggleBlock = (event) => {
    event.preventDefault();
    const isActive1 = blockType === format;

    const blockFormats = [
      "heading-one",
      "heading-two",
      "heading-three",
      "paragraph",
    ];
    blockFormats.forEach((blockFormat) => {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { match: (n) => SlateElement.isElement(n) && n.type === blockFormat }
      );
    });

    if (!isActive1) {
      Transforms.setNodes(
        editor,
        { type: format },
        { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
      );
      setBlockType(format);
    } else {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
      );
      setBlockType(null);
    }
  };

  const toggleColor = (event, color) => {
    event.preventDefault();
    Editor.addMark(editor, "color", color);
    setIsActive(true);
  };

  const toggleBgColor = (event, color) => {
    event.preventDefault();
    Editor.addMark(editor, "bgColor", color);
    setIsActive(true);
  };

  const colorChange = (event) => {
    const color = event.target.value;

    if (color && format === "color") {
      toggleColor(event, color);
    }
    if (color && format === "bg") {
      toggleBgColor(event, color);
    }
  };

  const insertLink = (url, text) => {
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    const link = {
      type: "link",
      url,
      children: isCollapsed ? [{ text: text }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  };

  const insertImage = (url) => {
    const image = { type: "image", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, image);
  };

  const handleClick = (event) => {
    if (["left", "center", "right"].includes(format)) {
      toggleAlign(event);
    } else if (LIST_TYPES.includes(format)) {
      toggleList(event);
    } else if (
      ["heading-one", "heading-two", "heading-three", "paragraph"].includes(
        format
      )
    ) {
      toggleBlock(event);
    } else if (format === "color") {
      colorRef.current.click();
    } else if (format === "bg") {
      bgRef.current.click();
    } else if (format === "link") {
      const url = prompt("Введіть URL: ");
      const text = prompt("Введіть текст: ");
      if (url && text) {
        insertLink(url, text);
      }
    } else if (format === "image") {
      const url = prompt("Введіть URL фотографії або Base64: ");
      if (url) {
        insertImage(url);
      }
    } else if (["ml", "mr", "mt", "mb"].includes(format)) {
      const val = prompt("Отступити (наприклад: 10px або 50% або auto): ");
      toggleMarkVal(event, val);
    } else if (format === "fs") {
      const val = prompt("Розмір шрифта в px: ");
      toggleMarkVal(event, val);
    } else {
      toggleMark(event);
    }
  };

  return (
    <button
      onMouseDown={handleClick}
      style={{
        margin: "0 4px",
        display: "inline-block",
        borderRadius: "10px",
        padding: "5px",
        border: isActive ? "1px solid gray" : "1px solid transparent",
        marginTop: "5px",
        marginBottom: "7px",
        ...style,
      }}
    >
      <img src={icon} alt={altText} width={25} height={25} />
      {(format === "color" || format === "bg") && (
        <input
          type="color"
          style={{ display: "none" }}
          onChange={colorChange}
          ref={format === "bg" ? bgRef : colorRef}
        />
      )}
    </button>
  );
};

const Toolbar = ({ className }) => {
  const [currentAlign, setCurrentAlign] = useState("left");
  const [blockType, setBlockType] = useState(null);
  const [listActive, setListActive] = useState(null);

  return (
    <div className={className}>
      <div>
        <div>
          <ToolbarButton format="bold" icon={boldImg} altText="bold" />
          <ToolbarButton format="italic" icon={italicImg} altText="italic" />
          <ToolbarButton
            format="underline"
            icon={underlineImg}
            altText="underline"
          />
          <ToolbarButton
            format="left"
            icon={textLeftImg}
            altText="textLeft"
            currentAlign={currentAlign}
            setAlign={setCurrentAlign}
          />
          <ToolbarButton
            format="center"
            icon={textCenterImg}
            altText="textCenter"
            currentAlign={currentAlign}
            setAlign={setCurrentAlign}
          />
          <ToolbarButton
            format="right"
            icon={textRightImg}
            altText="textRight"
            currentAlign={currentAlign}
            setAlign={setCurrentAlign}
          />
          <ToolbarButton format="fs" icon={fsimg} altText="font_size" />
          <ToolbarButton format="mt" icon={marginimg} altText="mt" />
        </div>
        <div>
          <ToolbarButton
            format="heading-one"
            icon={h1}
            altText="h1"
            blockType={blockType}
            setBlockType={setBlockType}
          />
          <ToolbarButton
            format="heading-two"
            icon={h2}
            altText="h2"
            blockType={blockType}
            setBlockType={setBlockType}
          />
          <ToolbarButton
            format="heading-three"
            icon={h3}
            altText="h3"
            blockType={blockType}
            setBlockType={setBlockType}
          />
          <ToolbarButton
            format="numbered-list"
            icon={ol}
            altText="ol"
            listActive={listActive}
            setListActive={setListActive}
          />
          <ToolbarButton
            format="bulleted-list"
            icon={ul}
            altText="ul"
            listActive={listActive}
            setListActive={setListActive}
          />
          <ToolbarButton
            format="ml"
            icon={marginimg}
            altText="ml"
            style={{ rotate: "-90deg" }}
          />
          <ToolbarButton
            format="mr"
            icon={marginimg}
            altText="mr"
            style={{ rotate: "90deg" }}
          />
          <ToolbarButton
            format="mb"
            icon={marginimg}
            altText="mb"
            style={{ rotate: "180deg" }}
          />
        </div>
      </div>
      <div>
        <div>
          <ToolbarButton format="color" icon={color} altText="color" />
          <ToolbarButton format="bg" icon={bg} altText="bg" />
        </div>
        <div>
          <ToolbarButton format="link" icon={linkimg} altText="link" />
          <ToolbarButton format="image" icon={image} altText="image" />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
