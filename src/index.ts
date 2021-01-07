import fs from "fs";
import path from "path";


/**
 * Convert a map into a JS object
 * @param map map to convert
 * @returns Object storing Map key value pairs
 */
const mapToObject = (map: Map<string, any>): Object => {
  let obj: any = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
};


/**
 * Convert a string to an HTML string
 * @param str String to convert
 * @returns linebreaks converted as <br>
 */
const toHTML = (str: string): string => {
  str = str.replace(/(?:<)/g, "&lt;");
  str = str.replace(/(?:>)/g, "&gt;");
  str = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
  str = str.replace(/\s/g, "&nbsp;");
  str = str.replace(/(?:\t)/g, "&nbsp;&nbsp;");
  return str;
};

const comments = new Map<string, string>();

/**
 * Build the comments map based on the file
 */
const buildComments = (): void => {
  try {
    const filepath = path.join(__dirname);
    const fileContents = fs.readFileSync(filepath + "/comments.json", "utf-8");
    const contents = JSON.parse(fileContents);
    contents.forEach((data: any) => {
      comments.set(`${data.language}`, `${data.comment}`);
    });
  } catch (err) {
    console.error("comments.json not found, defaulting to built in!");
    console.error(`${err}`);
    comments.set("c", "//");
    comments.set("cpp", "//");
    comments.set("cs", "//");
    comments.set("js", "//");
    comments.set("ts", "//");
    comments.set("swift", "//");
    comments.set("kt", "//");
    comments.set("py", "#");
    comments.set("rb", "#");
    comments.set("asm", ";");
  }
};

/**
 * Reads the language from the filename. Follows the format of `filename.code.language`, reading specifically the `language` part.
 * @param filename name of the file to read the language of
 * @returns the specific language
 * @throws Invalid file name if the filename doesn't contain a language or if the code extension isn't used.
 */
const getLanguage = (filename: string): string => {
  const vals: string[] = filename.split(".");
  if (vals.length < 3) {
    throw new Error(
      `${filename}: Invalid file name; filename must have three values: "name.code.language", where "name" is some name of the file, "code" as our key indicator to parse it, and "language" as the programming language of the file.`
    );
  } else if (vals[vals.length - 2] !== "code") {
    throw new Error(
      `${filename}: Invalid file name; filename doesn't have "code" as the second last value.`
    );
  }
  return vals[vals.length - 1];
};

/**
 * Read the file
 * @param filename file to read
 * @throws invalid filename if the file doesn't exist
 * @returns file contents as a string
 */
const read = (filename: string): string => {
  let str: string = "";
  try {
    str = fs.readFileSync(filename).toString();
  } catch (err) {
    str = `${filename} is an invalid filename, try again with a valid filename`;
  }
  return str;
};

/**
 * Get the key types from the code string
 * @param str Code string to parse the key from
 * @param comment Comment type based on the language, used to ignore the text, can be used as a means to read off of a normal file
 * @returns string array containing each key from the code string
 */
const getKeys = (str: string, comment: string): string[] => {
  let str2: string = str;
  const keys: string[] = [];
  let matcher: any = str2.match(new RegExp(`${comment}\\s*start\\s*:\\s*.*`));
  while (matcher !== null && matcher.length > 0) {
    keys.push(matcher[0].split(":")[1].trim());
    str2 = str2.substr(matcher["index"] + matcher[0].length);
    matcher = str2.match(new RegExp(`${comment}\\s*start\\s*:\\s*.*`));
  }
  return keys;
};

/**
 * Get the code snippet based on the key
 * @param str code string to snippet from
 * @param comment comment from language type
 * @param key key to snippet from
 * @returns code snippet from string
 */
const getCodeSnippet = (str: string, comment: string, key: string): string => {
  const start: any = str.match(
    new RegExp(`[^\\S\\r\\n]*${comment}\\s*start\\s*:\\s*${key}`)
  );
  const end: any = str.match(new RegExp(`[^\\S\\r\\n]*${comment}\\s*end\\s*:\\s*${key}`));
  if (start === null || end === null) {
    return `No snippet found! May be an issue at ${key}`;
  }
  let strSlice: string = str
    .slice(start["index"] + start[0].length, end["index"])
    .trim();
  // ignore the start, end comments in the nested slice
  let startComment: any = strSlice.match(
    new RegExp(`[^\\S\\r\\n]*${comment}\\s*start\\s*:.*\\n`)
  );
  let endComment: any = strSlice.match(
    new RegExp(`[^\\S\\r\\n]*${comment}\\s*end\\s*:.*\\n`)
  );
  while (startComment !== null && endComment !== null) {
    strSlice = strSlice.replace(startComment[0], "");
    strSlice = strSlice.replace(endComment[0], "");
    startComment = strSlice.match(new RegExp(`[^\\S\\r\\n]*${comment}\\s*start\\s*:.*\\n`));
    endComment = strSlice.match(new RegExp(`[^\\S\\r\\n]*${comment}\\s*end\\s*:.*\\n`));
  }
  return strSlice;
};

/**
 * Get the comment value based on the language provided, returns the comment value or "Language currently unsupported" if the language is unsupported
 * @param language language to get the comment type
 * @returns language comment value, "Language currently unsupported" if language is unsupported
 */
const getCommentType = (language: string): string => {
  const commentType: string | undefined = comments.get(language);
  return commentType !== undefined
    ? commentType
    : "Language currently unsupported";
};

/**
 * Reads the file and returns a map containing the key with the code snippet as the value pair
 * @param filename Filename to read from
 * @returns Map with the key as the key from getKey and the value as the code snippet from getCodeSnippet
 */
const readCode = (filename: string): Map<string, string> => {
  const codes: Map<string, string> = new Map<string, string>();
  const str: string = read(filename);
  const language: string = getLanguage(filename);
  const comment: string = getCommentType(language);
  if (comment === "Language currently unsupported") {
    codes.set(
      filename,
      "Currently unsupported language! Try again later or update the types of comments for each language in the comments.json file!"
    );
    return codes;
  }
  let keys: string[] = getKeys(str, comment);

  keys.forEach((key: string) => {
    codes.set(key, getCodeSnippet(str, comment, key));
  });

  return codes;
};


/**
 * Read the code from the given file, return a REST API Compatible Object
 * @param filename filename to read from
 * @returns Object form of Map from readCode, adds extra headers to help with parsing later
 */
const readCodeRest = (filename: string): any => {
  let code: Map<string, any> = new Map<string, any>();
  code.set("Filename", filename);
  let pulled: Map<string, string> = readCode(filename);
  let keys: string[] = [];
  pulled.forEach((_, key) => keys.push(key));
  code.set("Keys", keys);
  pulled.forEach((value, key) => code.set(key, value));
  return mapToObject(code);
};

/**
 * Read the code from the given file, return a REST API Compatible Object, with HTML Compatible elements
 * @param filename filename to read from
 * @returns Object form of Map from readCode, adds extra headers to help with parsing later
 */
const readCodeHtmlRest = (filename: string) : any => {
  let code: Map<string, any> = new Map<string, any>();
  code.set("Filename", filename);
  let pulled: Map<string, string> = readCode(filename);
  let keys: string[] = [];
  pulled.forEach((_, key) => keys.push(key));
  code.set("Keys", keys);
  pulled.forEach((value, key) => code.set(key, toHTML(value)));
  return mapToObject(code);
}


/**
 * Code testing
 */
const test = () => {
  buildComments();
  let dir = path.join(__dirname, "codes");
  // let code = readCodeHtmlRest(dir + "/helloworld.code.c");
  dir = path.join(dir, "typescript");
  dir = path.join(dir, "structs");
  let code = readCodeHtmlRest(dir + "/LinkedList.code.ts");
  // console.info(code["main"]);
  // console.info(toHTML(code["main"]));
  console.info(code);
};

// test();

export { buildComments, readCode, readCodeHtmlRest, readCodeRest };
