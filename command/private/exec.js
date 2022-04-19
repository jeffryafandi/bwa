const { owner } = require("../../config.json");

let cp = require('child_process')
let { promisify } = require('util')
let exec = promisify(cp.exec).bind(cp)
module.exports = {
  name: "execute",
  alias: ["exec"],
  category: "private",
  async exec(msg, sock, args) {
    const { sender, from } = msg;
    let code = args.join(" ")
    if (!owner.includes(sender)) return await msg.reply("You are not my owner");
    const input = clean(code);

    msg.reply('Executing...')
    let o
    try {
      o = await exec(input.trimEnd())
    } catch (e) {
      o = e
    } finally {
      let { stdout, stderr } = o
      if (stdout.trim()) msg.reply(stdout)
      if (stderr.trim()) msg.reply(stderr)
    }
  }
};
function clean(text) {
    if (typeof text === "string")
        return text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`);
    // eslint-disable-line prefer-template
    else return text;
}
