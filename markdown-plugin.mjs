// @ts-check

import MarkdownApplication from 'typedoc-plugin-markdown';

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
    app.renderer.on(MarkdownApplication.MarkdownPageEvent.BEGIN, (page) => {
        page.filename = page.filename.replaceAll("varhub:", 'varhub_');
    });
    app.renderer.on(MarkdownApplication.MarkdownPageEvent.END, (page) => {
        page.contents = page.contents.replaceAll('(namespaces/varhub:', '(namespaces/varhub_');
    });
}