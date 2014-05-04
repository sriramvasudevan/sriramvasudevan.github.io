
    var wars = false;
    var LINES_PER_FRAME = 14;
var DELAY_NORMAL = 67;
var DELAY_FAST = 17;
var DELAY_VERYFAST = 1;

var g_currentFrame = 0;
var g_updateDelay = DELAY_NORMAL;
var g_frameStep = 1; //advance one frame per tick
var g_timerHandle = null;

var term=new Array();

var helpPage=[
    '%n%+r Terminal Help %-r%n',
    '  Use one of the following commands:',
    '     clear .... clear the terminal',
    '     id ....... show terminal\'s id',
    '     help ..... show this help page',
    '     ls ....... lists data',
    '     cd ....... open link',
    ' '
];

var myname=[
    '%c(7) ____       _                      __     __',
    '/ ___| _ __(_)_ __ __ _ _ __ ___   \\ \\   / /',
    '\\___ \\| \'__| | \'__/ _` | \'_ ` _ \\   \\ \\ / / ',
    ' ___) | |  | | | | (_| | | | | | |   \\ V /_ ',
    '|____/|_|  |_|_|  \\__,_|_| |_| |_|    \\_/(_)',
    ' '
];

var folder='';

function termOpen(n) {
    if (!term[n]) {
        term[n]=new Terminal(
            {
            x: 20,
            y: 20,
            cols: 100,
            rows: 50,
            greeting: '%+r +++ Welcome. +++ %-r%nType "help" for help.%n',
            id: n,
            termDiv: 'termDiv'+n,
            frameWidth:0,
            bgColor: '#300a24',
            crsrBlinkMode: true,
            closeOnESC: false,
            ps: 'vsriram@cse.iitm:~$',
            handler: termHandler,
        }
        );
        if (term[n]) term[n].open();
    }
    else if (term[n].closed) {
        term[n].open();
    }
    else {
        term[n].focus();
    }
}

function displayFrame(terminal) {
    if(validateFrame(g_currentFrame) != true) {
        return;
    }

    terminal.clear();

    for (var line = 1; line < 14; line++)
    {
        var lineText = film[ (g_currentFrame * LINES_PER_FRAME) + line];
        if( !lineText || lineText.length < 1 )
            lineText = ' ';
        lineText += '%n';
        terminal.write(lineText);
    }
}

function validateFrame(frameNumber)
{
    return ( frameNumber > 0 && frameNumber < Math.floor( film.length / LINES_PER_FRAME ) )
}


function updateDisplay(terminal)
{
    if(g_timerHandle) {
        clearTimeout(g_timerHandle);
    }
    displayFrame(terminal);
    if(g_frameStep != 0) {
        //read the first line of the current frame as it is a number containing how many times this frame should be displayed
        var nextFrameDelay = film[ g_currentFrame * LINES_PER_FRAME ] * g_updateDelay;
        var nextFrame = g_currentFrame + g_frameStep;
        if(validateFrame(nextFrame) == true)
            g_currentFrame = nextFrame;
        g_timerHandle = setTimeout(function() { updateDisplay(terminal); }, nextFrameDelay);
    }
}

function termHandler() {
    // called on <CR> or <ENTER>
    this.newLine();
    var cmd=this.lineBuffer;
    if (cmd!='') {
        if (cmd=='switch') {
            var other=(this.id==1)? 2:1;
            termOpen(other);
        }
        else if (cmd=='clear') {
            this.clear();
        }
        else if (cmd=='ls') {
            listSections(this);
        }
        else if (cmd=='easteregg') {
            this.write(myname);
        }
        else if (cmd=='starwars') {
            g_frameStep = 1;
            g_updateDelay = DELAY_NORMAL;
            wars = true;
            updateDisplay(this);
        }
        else if (cmd=='q') {
            g_frameStep = 0;
            if(g_timerHandle) {
                clearTimeout(g_timerHandle);
            }
        }
        else if (cmd.substring(0,3)=='cd ') {
            var arg = cmd.split(" ");
            if (folder=='') {
                if(arg[1]=='About' || arg[1]=='About/') {
                    folder = '/About';
                }
                else if(arg[1]=='Courses' || arg[1]=='Courses/') {
                    folder = '/Courses';
                }
                else if(arg[1]=='Links' || arg[1]=='Links/') {
                    folder = '/Links';
                }
                else if(arg[1]=='Contact' || arg[1]=='Contact/') {
                    folder = '/Contact';
                }
                else if(arg[1]=='..' || arg[1]=='../') {
                    folder = '';
                }
                else {
                    this.write('bash: cd: '+arg[1]+': No such file or directory');
                }
            }
            else {
                if(arg[1]=='..' || arg[1]=='../') {
                    folder = '';
                }
                else {
                    this.write('bash: cd: '+arg[1]+': No such file or directory');
                }
            }

            var psdisp = 'vsriram@cse.iitm:~' + folder; 
            this.ps = psdisp + '$';
            document.title = psdisp;
        }
        else if (cmd=='help') {
            this.write(helpPage);
        }
        else if (cmd=='id') {
            this.write('terminal id: '+this.id);
        }
        else {
            this.type(cmd + ': command not found');
            this.newLine();
        }
    }
    this.prompt();
}

function listSections(terminal) {
    if(folder=='/About') {
        terminal.write('%c(37)%n My name is Sriram V, and I\'m pursing a Bachelor\'s degree in Computer Science and Engineering at the Indian Institute of Technology, Madras. I\'m currently in my junior year of college.%n%n');
    }
    else if(folder=='/Courses') {
        terminal.write('%c(80)%nSwitching Theory and Digital Design (CS2300)%nBasic Graph Theory (MA2130)%nProbability, Statistics and Stochastic proccesses (MA2400)%nDiscrete Mathematics for Computer Science (CS2100)%nLanguages, Machines and Computation (CS2200)%nPrinciples of Communication (CS2400)%nComputer Organization (CS2600)%nData Structures and Algorithms (CS2800)%nLanguage Translators (CS3300)%nOperating Systems (CS3500)%nParadigms of Programming (CS3100)%nIntroduction to Database Systems (CS3700)%nIntroduction to Machine Learning (CS5011)%nArtificial Intelligence (CS6380)%n%n');
    }
    else if(folder=='/Links') {
        terminal.write('%c(80)%nFacebook - www.facebook.com/sriram.vasudevan%nTwitter - www.twitter.com/vasudevansriram%nGoogle+ - plus.google.com/+SriramV15%nGitHub - www.github.com/sriramvasudevan%nLinkedIn - www.linkedin.com/vasudevansriram%n%n');
    }
    else if(folder=='/Contact') {
        terminal.write('%c(34)%n You can drop me a mail at <username>@<hostname>.ac.in or at me@<myname>.com %n%n');
    }
    else {
        terminal.write("%c(15)About/\t\t\tCourses/\t\t\tLinks/\t\t\tContact/");
    }
}