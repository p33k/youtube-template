import { App, PluginSettingTab, Setting, TFolder } from 'obsidian';
import YoutubeTemplatePlugin from './main';
import { DEFAULT_CHAPTER_FORMAT, DEFAULT_HASHTAG_FORMAT, DEFAULT_TEMPLATE, ROOT_FOLDER } from './utils/constants';
import { getAllTFolders } from './utils/file';

export interface YouTubeTemplatePluginSettings {
  googleCloudApiKey: string;
  folder: string;
  chapterFormat: string;
  hashtagFormat: string;
  template: string;
  createPaths: boolean;
}

export const DEFAULT_SETTINGS: YouTubeTemplatePluginSettings = {
  googleCloudApiKey: '',
  folder: ROOT_FOLDER,
  chapterFormat: DEFAULT_CHAPTER_FORMAT,
  hashtagFormat: DEFAULT_HASHTAG_FORMAT,
  template: DEFAULT_TEMPLATE,
  createPaths: true,
};

export class YouTubeTemplatePluginSettingsTab extends PluginSettingTab {
  plugin: YoutubeTemplatePlugin;

  constructor(app: App, plugin: YoutubeTemplatePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Google Cloud API Key')
      .setDesc(
        "It's a secret API key that you can get from Google Cloud Console (https://console.cloud.google.com/apis/credentials)",
      )
      .addText((text) =>
        text
          .setPlaceholder('Enter your API key')
          .setValue(this.plugin.settings.googleCloudApiKey)
          .onChange(async (value) => {
            this.plugin.settings.googleCloudApiKey = value;
            await this.plugin.saveSettings();
          }),
      );

    const rootFolder = this.app.vault.getAbstractFileByPath('/') as TFolder;
    const folders = getAllTFolders(rootFolder);
    const folderOptions = Object.fromEntries(folders.map((folder) => [folder.path, folder.path]));

    new Setting(containerEl)
      .setName('Folder to save the templates')
      .setDesc('Choose the folder where you want to save the templates. The default value is the root folder of your vault.')
      .addDropdown((dropdown) =>
        dropdown
          .addOptions(folderOptions)
          .setValue(this.plugin.settings.folder)
          .onChange(async (value) => {
            this.plugin.settings.folder = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Create folders')
      .setDesc('Turn on if you want to create the folders for the templates and attachments if they do not exist.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.createPaths).onChange(async (value) => {
          this.plugin.settings.createPaths = value;
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName('Chapter format')
      .setDesc('Make the template that will be used to insert chapters. You can use the following variables: {{chapter}}.')
      .addTextArea((text) =>
        text
          .setPlaceholder(DEFAULT_CHAPTER_FORMAT)
          .setValue(this.plugin.settings.chapterFormat)
          .onChange(async (value) => {
            this.plugin.settings.chapterFormat = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Hashtag format')
      .setDesc('Make the template that will be used to insert hashtags. You can use the following variables: {{hashtag}}.')
      .addTextArea((text) =>
        text
          .setPlaceholder(DEFAULT_HASHTAG_FORMAT)
          .setValue(this.plugin.settings.hashtagFormat)
          .onChange(async (value) => {
            this.plugin.settings.hashtagFormat = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Template')
      .setDesc(
        'Make the template that will be used to create the note. You can use the following variables: {{title}}, ' +
          '{{channelName}}, {{subscribers}}, {{length}}, {{publishDate}}, {{thumbnail}}, {{chapters}}, {{hashtags}}, ' +
          '{{description}}, {{noteCreated}}, {{youtubeUrl}}.',
      )
      .addTextArea((text) =>
        text.setValue(this.plugin.settings.template).onChange(async (value) => {
          this.plugin.settings.template = value;
          await this.plugin.saveSettings();
        }),
      )
      .setClass('youtube-template-plugin__template-textarea');
  }
}
