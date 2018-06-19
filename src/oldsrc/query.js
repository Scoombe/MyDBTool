$(function () {
    const {ipcRenderer} = require('electron');
    const sqlFormatter = require('sql-formatter');
    const formatQ = function (q) {
        let formatted = sqlFormatter.format(q);
        formatted = '<pre>' + formatted;
        formatted = formatted.replace(/([sS][eE][lL][eE][cC][tT])/g, '</pre><p style="color: deepskyblue;font-weight: bold;">Select</p><pre>');
        formatted = formatted.replace(/([fF][rR][oO][mM])$/mg, '</pre><p style="color: deepskyblue;font-weight: bold;">From</p><pre>');
        let comments = formatted.match(/(^--.*|--.*)/g);
        let aliases = formatted.match(/([aA][sS]\s['].*['][,]?|[aA][sS]\s(.*?!\))[,]?)/g);
        console.log(aliases);
        let managerAliases = formatted.match(/([aA][sS]\s[_].*[_][,]?)/g);
        if (aliases) {
            for (let i = 0; i < aliases.length; i++) {
                formatted = formatted.replace(' ' + aliases[i], '</pre><p style="color: lightblue;">' + aliases[i] + '</p><pre>');
            }
        }
        if (managerAliases) {
            for (let i = 0; i < managerAliases.length; i++) {
                formatted = formatted.replace(' ' + managerAliases[i], '</pre><p style="color: lightblue;">' + managerAliases[i] + '</p><pre>');
            }
        }
        if (comments) {
            for (let i = 0; i < comments.length; i++) {
                formatted = formatted.replace(comments[i], comments[i] + 'comment');
                formatted = formatted.replace(comments[i] + 'comment', '<p style="color: lightgrey;font-style: italic">' + comments[i] + '</p>');
            }
        }
        console.log(formatted);
        console.log(formatted.match(/(([\s\n\r])*(IF\(|if\()(\n|\r|\t|\v)*(.*(?=,))(,)(\n|\r|\t|\v)*(.*(?=,))(,)(\n|\r|\t|\v)*(.*(?=[\n\r]))(\n|\r|\t|\v)*(.*(?=\)))(\))([<][/][p][r][e][>]))/g));
        // Need to find ones where the comma isnt on the first line after the if
        formatted = formatted.replace(/(<pre>)/g, '<pre style="color: #bcc0cb;">');

        formatted += '</pre>';
        return formatted
    };

    ipcRenderer.send('child-ready', 'ready');

    ipcRenderer.on('childq', (event, arg) => {
        console.log('ipcrenderer' + event);
        $('#q').html(formatQ(arg));
    });

    $('#exit').click(function () {

        ipcRenderer.send('close-req', 'child');
    });
    /*
    ^([sS][eE][lL][eE][cC][tT]) = SELECT -- done
    (if[(])+ = if(
    ([aA][sS].['].*['][,]) = as 'asdoasdisndioand - asoidhnaosdnosadn' -- done
    ([fF][rR][oO][mM]) = from
    ([Ww][hH][eE][Rr][eE]) = where
    string.match(/((COUNT\((\n|\r|\t|\v)*(DISTINCT|distinct)?(\s*)?)(\n|\r|\t|\v)*(if\()?(.*)?(\n|\r|\t|\v)*((.*)(,)?(\n|\r|\t|\v)*)+(\))?(\n|\r|\t|\v)?(\))+)/mg); finds any count distinct ifs

    (^--.*) = comments




      let counts = formatted.match(/((COUNT\((\n|\r|\t|\v)*(DISTINCT|distinct)?(\s*)?)(\n|\r|\t|\v)*(if\()?(.*)?(\n|\r|\t|\v)*((.*)(,)?(\n|\r|\t|\v)*)+(\))?(\n|\r|\t|\v)?(\))+)/mg);
         if (counts) {
            for (let i = 0; i < counts.length; i++) {
                formatted = formatted.replace(counts[i], counts[i] + 'count');
                formatted = formatted.replace(counts[i] + 'count', '</pre><span style="color: cornflowerblue;">' + counts[i] + '</span><pre>');
            }
        }




/(^(<pre>)(\s)*(IF\(|if\()(\n|\r|\t|\v)*(.*?=,)(\n|\r|\t|\v)*(.*?=,)(\n|\r|\t|\v)*)/mg

        <pre>  IF(
    date(sessions.START_TIME) = date(sessions.END_TIME),
    CAST(TIME(sessions.END_TIME) AS CHAR),
    CAST(sessions.END_TIME AS CHAR)
  )</pre>
     */
});