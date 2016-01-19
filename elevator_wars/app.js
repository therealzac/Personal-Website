var createEditor = function() {
    var localStorageKey = "Elevator_Wars";

    var cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        indentUnit: 2,
        indentWithTabs: false,
        theme: "solarized light",
        mode: "javascript",
        autoCloseBrackets: true,
        extraKeys: {
            // Allows for tab button to work in textarea.
            Tab: function(cm) {
                var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces);
            }
        }
    });

    cm.on("change", function(codeMirror, change) {
        if (change.origin !== "paste") { return; }

        var lineFrom = change.from.line;
        var lineTo = change.from.line + change.text.length;

        function reindentLines(codeMirror, lineFrom, lineTo) {
            codeMirror.operation(function() {
                codeMirror.eachLine(lineFrom, lineTo, function(lineHandle) {
                    codeMirror.indentLine(lineHandle.lineNo(), "smart");
                });
            });
        }

        reindentLines(codeMirror, lineFrom, lineTo);
    });

    var reset = function() {
        cm.setValue($("#default-elev-implementation").text().trim());
    };
    var saveCode = function() {
        localStorage.setItem(localStorageKey, cm.getValue());
        $("#save_message").text("Code saved " + new Date().toTimeString());
        returnObject.trigger("change");
    };

    var existingCode = localStorage.getItem(localStorageKey);
    if (existingCode) { cm.setValue(existingCode); }
    else { reset(); }

    $("#button_save").click(function() {
        saveCode();
        cm.focus();
    });

    $("#button_reset").click(function() {
        if (confirm("Are you sure you want to reset?")) {
            localStorage.setItem("develevateBackupCode", cm.getValue());
            reset();
        }
        cm.focus();
    });

    $("#button_resetundo").click(function() {
        cm.setValue(localStorage.getItem("develevateBackupCode") || "")
        cm.focus();
    });

    var returnObject = riot.observable({});
    var autoSaver = _.debounce(saveCode, 1000);
    cm.on("change", function() {
        autoSaver();
    });

    returnObject.getCodeObj = function() {
        var code = cm.getValue();
        var obj;
        try {
            obj = getCodeObjFromCode(code);
            returnObject.trigger("code_success");
        } catch(e) {
            returnObject.trigger("usercode_error", e);
            return null;
        }
        return obj;
    };

    returnObject.setCode = function(code) {
        cm.setValue(code);
    };

    returnObject.getCode = function() {
        return cm.getValue();
    };

    returnObject.setDevTestCode = function() {
        cm.setValue($("#devtest-elev-implementation").text().trim());
    };

    $("#button_apply").click(function() {
        returnObject.trigger("apply_code");
    });

    return returnObject;
};


var createParamsUrl = function(current, overrides) {
  return "#" + _.map(_.merge(current, overrides), function(val, key) {
      return key + "=" + val;
  }).join(",");

    // var params = "#" + _.map(_.merge(current, overrides), function(val, key) {
    //     return key + "=" + val;
    // });
    //
    // return params.join(",");
};



$(function() {
    var timeScaleKey = "elevatorTimeScale";
    var editor = createEditor();

    var params = {};

    var $world = $(".innerworld");
    var $stats = $(".statscontainer");
    var $feedback = $(".feedbackcontainer");
    var $challenge = $(".challenge");
    var $codestatus = $(".codestatus");

    var floorTemplate = document.getElementById("floor-template");
    floorTemplate = floorTemplate.innerHTML.trim();
    var elevatorTemplate = document.getElementById("elevator-template");
    elevatorTemplate = elevatorTemplate.innerHTML.trim();
    var elevatorButtonTemplate = document.getElementById("elevatorbutton-template");
    elevatorButtonTemplate = elevatorButtonTemplate.innerHTML.trim();
    var userTemplate = document.getElementById("user-template");
    userTemplate = userTemplate.innerHTML.trim();
    var challengeTemplate = document.getElementById("challenge-template");
    challengeTemplate = challengeTemplate.innerHTML.trim();
    var feedbackTemplate = document.getElementById("feedback-template");
    feedbackTemplate = feedbackTemplate.innerHTML.trim();
    var codeStatusTemplate = document.getElementById("codestatus-template");
    codeStatusTemplate = codeStatusTemplate.innerHTML.trim();

    var app = riot.observable({});
    app.worldController = createWorldController(1.0 / 60.0);
    app.worldController.on("usercode_error", function(e) {
        editor.trigger("usercode_error", e);
    });

    app.worldCreator = createWorldCreator();
    app.world = undefined;

    app.currentchallengeNum = 0;

    app.startStopOrRestart = function() {
        if (app.world.challengeEnded) {
            app.startChallenge(app.currentchallengeNum);
        } else {
            app.worldController.setPaused(!app.worldController.isPaused);
        }
    };

    app.startChallenge = function(challengeNum, autoStart) {
        if (typeof app.world !== "undefined") { app.world.unWind(); }
        app.currentchallengeNum = challengeNum;
        app.world = app.worldCreator.createWorld(challenges[challengeNum].options);
        window.world = app.world;

        clearAll([$world, $feedback]);
        presentStats($stats, app.world);

        presentChallenge(
          $challenge,
          challenges[challengeNum],
          app,
          app.world,
          app.worldController,
          challengeNum + 1,
          challengeTemplate
        );

        presentWorld(
          $world,
          app.world,
          floorTemplate,
          elevatorTemplate,
          elevatorButtonTemplate,
          userTemplate
        );

        app.worldController.on("timescale_changed", function() {
            localStorage.setItem(timeScaleKey, app.worldController.timeScale);

            presentChallenge($challenge,
              challenges[challengeNum],
              app,
              app.world,
              app.worldController,
              challengeNum + 1,
              challengeTemplate
            );
        });

        app.world.on("stats_changed", function() {
            var status = challenges[challengeNum].condition.evaluate(app.world);
            if (status !== null) {
                app.world.challengeEnded = true;
                app.worldController.setPaused(true);
                if (status) {
                    presentFeedback(
                      $feedback,
                      feedbackTemplate,
                      app.world,
                      "Mission Accomplished!",
                      "",
                      createParamsUrl(params, { challenge: (challengeNum + 2)})
                    );
                } else {
                    presentFeedback(
                      $feedback,
                      feedbackTemplate,
                      app.world,
                      "Mission Failed",
                      "Tweak your code and try again.",
                      ""
                    );
                }
            }
        });

        var codeObject = editor.getCodeObj();
        app.worldController.start(
          app.world,
          codeObject,
          window.requestAnimationFrame,
          autoStart
        );
    };

    editor.on("apply_code", function() {
        app.startChallenge(app.currentchallengeNum, true);
    });

    editor.on("code_success", function() {
        presentCodeStatus($codestatus, codeStatusTemplate);
    });

    editor.on("usercode_error", function(error) {
        presentCodeStatus($codestatus, codeStatusTemplate, error);
    });

    riot.route(function(path) {
        params = _.reduce(path.split(","), function(result, p) {
            var match = p.match(/(\w+)=(\w+$)/);
            if (match) { result[match[1]] = match[2]; }
            return result;
        }, {});

        var thisChallenge = 0;
        var autoStart = false;
        var timeScale = parseFloat(localStorage.getItem(timeScaleKey)) || 2.0;
        _.each(params, function(val, key) {
            if (key === "challenge") {
                thisChallenge = _.parseInt(val) - 1;
                if (thisChallenge < 0 || thisChallenge >= challenges.length) {
                    thisChallenge = 0;
                }
            } else if (key === "autostart") {
                autoStart = val === "false" ? false : true;
            } else if (key === "timescale") {
                timeScale = parseFloat(val);
            } else if (key === "devtest") {
                editor.setDevTestCode();
            } else if (key === "fullscreen") {
                makeDemoFullscreen();
            }
        });

        app.worldController.setTimeScale(timeScale);
        app.startChallenge(thisChallenge, autoStart);
    });
});
