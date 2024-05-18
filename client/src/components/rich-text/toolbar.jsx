import React, { useCallback, useEffect, useState } from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Text } from "slate";
import boldImg from "../../assets/images/admin/rich/bold.svg";
import italicImg from "../../assets/images/admin/rich/italic.svg";
import underlineImg from "../../assets/images/admin/rich/underline.svg";
import textLeftImg from "../../assets/images/admin/rich/align-left.svg";
import textCenterImg from "../../assets/images/admin/rich/align-center.svg";
import textRightImg from "../../assets/images/admin/rich/align-right.svg";

const ToolbarButton = ({ format, icon, altText }) => {
  const editor = useSlate();
  const [isActive, setIsActive] = useState(false);

  const isMarkActive = useCallback(() => {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[format] === true,
      universal: true,
    });

    return !!match;
  }, [editor, format]);

  useEffect(() => {
    setIsActive(isMarkActive());
  }, [editor.selection, isMarkActive]);

  const toggleMark = (event) => {
    event.preventDefault();
    const isActive1 = isMarkActive();

    Transforms.setNodes(
      editor,
      { [format]: isActive1 ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );

    if (!isActive1) {
      editor.addMark(format, true);
    } else {
      editor.removeMark(format);
    }

    setIsActive(!isActive);
  };

  return (
    <button
      onMouseDown={toggleMark}
      style={{
        margin: "0 4px",
        display: "inline-block",
        borderRadius: "10px",
        padding: "5px",
        border: isActive ? "1px solid gray" : "1px solid transparent",
        marginTop: "5px",
        marginBottom: "7px",
      }}
    >
      <img src={icon} alt={altText} width={20} height={20} />
    </button>
  );
};

const Toolbar = ({ className }) => {
  return (
    <div className={className}>
      <ToolbarButton format="bold" icon={boldImg} altText="bold" />
      <ToolbarButton format="italic" icon={italicImg} altText="italic" />
      <ToolbarButton
        format="underline"
        icon={underlineImg}
        altText="underline"
      />
      <ToolbarButton format="textLeft" icon={textLeftImg} altText="textLeft" />
      <ToolbarButton
        format="textCenter"
        icon={textCenterImg}
        altText="textCenter"
      />
      <ToolbarButton
        format="textRight"
        icon={textRightImg}
        altText="textRight"
      />
    </div>
  );
};

export default Toolbar;
