const formattedText = (text: string) => text.replace(/\u2028/g, '').split('\n');
const formattedLink = (text: string) =>
  text.match(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm);

export { formattedText, formattedLink };
