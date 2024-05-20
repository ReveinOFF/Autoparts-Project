const serialize = (nodes) => {
  return nodes
    .map((node) => {
      const style = `
        text-align: ${node.align};
        margin-left: ${node.ml};
        margin-right: ${node.mr};
        margin-top: ${node.mt};
        margin-bottom: ${node.mb};
        margin-inline: ${node.mx};
        margin-block: ${node.my};
        `;
      const styleImg = `
        justify-content: ${node.align};
        margin-left: ${node.ml};
        margin-right: ${node.mr};
        margin-top: ${node.mt};
        margin-bottom: ${node.mb};
        margin-inline: ${node.mx};
        margin-block: ${node.my};
        `;
      switch (node.type) {
        case "paragraph":
          return `<p style="${style}">${serialize(node.children)}</p>`;
        case "heading-one":
          return `<h1 style="${style}">${serialize(node.children)}</h1>`;
        case "heading-two":
          return `<h2 style="${style}">${serialize(node.children)}</h2>`;
        case "heading-three":
          return `<h3 style="${style}">${serialize(node.children)}</h3>`;
        case "bulleted-list":
          return `<ul style="${style}">${serialize(node.children)}</ul>`;
        case "numbered-list":
          return `<ol style="${style}">${serialize(node.children)}</ol>`;
        case "list-item":
          return `<li style="${style}">${serialize(node.children)}</li>`;
        case "link":
          return `<a style="color: blue; ${style}" href="${
            node.url
          }">${serialize(node.children)}</a>`;
        case "image":
          return `<p style="display: flex; ${styleImg}"><img src="${node.url}" alt="img" /></p>`;
        default:
          return serializeMarks(node);
      }
    })
    .join("");
};

const serializeMarks = (node) => {
  if (!node.text) {
    return "";
  }

  let text = node.text;
  if (node.bold) {
    text = `<strong>${text}</strong>`;
  }
  if (node.italic) {
    text = `<em>${text}</em>`;
  }
  if (node.underline) {
    text = `<u>${text}</u>`;
  }

  const style = `
    color: ${node.color || "inherit"};
    background-color: ${node.bgColor || "inherit"};
    font-size: ${node.fs || "inherit"}px;
  `;

  return `<span style="${style}">${text}</span>`;
};

const ConvertJsonToHtml = ({ content }) => serialize(content);

export default ConvertJsonToHtml;
