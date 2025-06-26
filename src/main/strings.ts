// Utility functions for string formatting

function blockLines(indent: number, str: string): string[] {
	const lines: string[] = str.split("\n");
	lines.shift();
	if (lines[lines.length - 1].trimEnd() === "") {lines.pop();}
	return lines.map((line: string): string => line.trimEnd().slice(indent));
}

/**
 * Parse a multiline string provided in the expected format,
 * with each line indented by a given number of characters,
 * the first line ignored, and the last line ignored if empty.
 * @param indent number of characters each line is indented
 * @param str multiline string
 * @returns string formatted as expected
 */
export function block(indent: number, str: string): string {
	return blockLines(indent, str).join("\n");
}

/**
 * Parse a folded string provided in the expected format,
 * with each line indented by a given number of characters,
 * the first line ignored, and the last line ignored if empty.
 * Newlines will be replaced with spaces.
 * Use an empty line to generate a newline in the output.
 * @param indent number of characters each line is indented
 * @param str multiline string
 * @returns string formatted as expected
 */
export function fold(indent: number, str: string): string {
	const lines: string[] = blockLines(indent, str);
	const resText: string[] = [];
	let lastLineWasNotEmpty: boolean = false;
	for (const line of lines) {
		if (line === "") {
			resText.push("\n");
			lastLineWasNotEmpty = false;
		} else {
			if (lastLineWasNotEmpty) {resText.push(" ");}
			resText.push(line);
			lastLineWasNotEmpty = true;
		}
	}
	return resText.join("");
}
