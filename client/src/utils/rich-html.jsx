const serialize = (nodes) => {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "paragraph":
          return `<p>${serialize(node.children)}</p>`;
        case "heading-one":
          return `<h1>${serialize(node.children)}</h1>`;
        case "heading-two":
          return `<h2>${serialize(node.children)}</h2>`;
        case "heading-three":
          return `<h3>${serialize(node.children)}</h3>`;
        case "bulleted-list":
          return `<ul>${serialize(node.children)}</ul>`;
        case "numbered-list":
          return `<ol>${serialize(node.children)}</ol>`;
        case "list-item":
          return `<li>${serialize(node.children)}</li>`;
        case "link":
          return `<a href="${node.url}">${serialize(node.children)}</a>`;
        case "image":
          return `<p><img src="${serialize(node.url)}}" alt="img" /></p>`;
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

  return `<span>${text}</span>`;
};

const ConvertJsonToHtml = ({ content }) => serialize(content);

export default ConvertJsonToHtml;
