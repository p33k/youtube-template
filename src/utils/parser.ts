import { App, moment } from 'obsidian';

export function parseVideoId(url: string): string | null {
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  const result = regex.exec(url);
  return result ? result[3] : null;
}

export function parseChapters(description: string): {
  timestamp: string;
  title: string;
}[] {
  // Extract timestamps (either 00:00:00, 0:00:00, 00:00 or 0:00)
  const lines = description.split('\n');
  const regex = /(\d{0,2}:?\d{1,2}:\d{2})/g;
  const chapters = [];

  for (const line of lines) {
    // Match the regex and check if the line contains a matched regex
    const matches = line.match(regex);
    if (matches) {
      const ts = matches[0];
      const title = line
        .split(' ')
        .filter((l) => !l.includes(ts))
        .join(' ');

      chapters.push({
        timestamp: ts,
        title: title,
      });
    }
  }

  return chapters;
}

export function parseISODuration(data: string): string {
  const duration = moment.duration(data);
  return `${duration.hours() > 0 ? duration.hours() + ':' : ''}${duration.minutes()}:${duration.seconds()}`;
}

export function filterFilename(text: string): string {
  return text.replace(/[/\\?%*:|"<>]/g, '');
}

export function filterStringData(text: string): string {
  return text.replace(/"(.*?)"/g, '«$1»').replace(/["]/g, '');
}

export function getAttachmentFolder(app: App): string {
  const attachentPath = app.vault.getConfig('attachmentFolderPath');

  if (attachentPath.startsWith('./')) {
    if (attachentPath.length === 2) return '/';

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) throw new Error("No active file. Can't parse the path for the attachment folder.");

    let parentFolder = activeFile?.parent?.path;
    if (parentFolder?.startsWith('/')) parentFolder = parentFolder.substring(1);

    return parentFolder + attachentPath.substring(2);
  }

  return attachentPath;
}
