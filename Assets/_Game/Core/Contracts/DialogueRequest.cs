using System;
using UnityEngine;

namespace EthGame.Core
{
    /// <summary>Everything the dialogue box (W3) needs to show one conversation.</summary>
    [Serializable]
    public class DialogueRequest
    {
        public string speakerName;
        public Sprite portrait;

        /// <summary>Audio id of the per-character blip, see Core/Docs/Conventions.md.</summary>
        public string blipSfxId = "sfx_blip_default";

        [TextArea(2, 5)] public string[] lines;

        /// <summary>Optional choices shown after the last line. Empty = no choice.</summary>
        public string[] choices = Array.Empty<string>();

        /// <summary>Called with the chosen index (or -1 if there were no choices) when the box closes.</summary>
        [NonSerialized] public Action<int> onFinished;

        public DialogueRequest() { }

        public DialogueRequest(string speaker, params string[] lines)
        {
            speakerName = speaker;
            this.lines = lines;
        }
    }
}
