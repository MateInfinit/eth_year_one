using System;

namespace EthGame.Core
{
    /// <summary>
    /// The ONLY way modules talk to each other.
    /// Naming: Request* = "please do this" (someone else handles it),
    ///         Raise*/On* = "this happened" (anyone may listen).
    /// Subscribe in OnEnable, unsubscribe in OnDisable.
    /// Changing this file = contract change → issue + W1 + review by all owners.
    /// </summary>
    public static class GameEvents
    {
        // ---------- Stats (handled by W1 StatsSystem) ----------
        /// <summary>Request a relative change, e.g. (Stat.Money, -2). Handled by Core.</summary>
        public static event Action<Stat, int> OnStatChangeRequested;
        /// <summary>A stat now has this new absolute value. HUD listens.</summary>
        public static event Action<Stat, int> OnStatChanged;
        public static event Action<int> OnLevelUp;

        public static void RequestStatChange(Stat stat, int delta) => OnStatChangeRequested?.Invoke(stat, delta);
        public static void RaiseStatChanged(Stat stat, int newValue) => OnStatChanged?.Invoke(stat, newValue);
        public static void RaiseLevelUp(int newLevel) => OnLevelUp?.Invoke(newLevel);

        // ---------- Dialogue (handled by W3) ----------
        public static event Action<DialogueRequest> OnDialogueRequested;
        public static event Action OnDialogueStarted;
        public static event Action OnDialogueFinished;

        public static void RequestDialogue(DialogueRequest request) => OnDialogueRequested?.Invoke(request);
        public static void RaiseDialogueStarted() => OnDialogueStarted?.Invoke();
        public static void RaiseDialogueFinished() => OnDialogueFinished?.Invoke();

        // ---------- Boss fights (requested by W2, loaded by W1, played by W4) ----------
        public static event Action<BossDefinition> OnBossFightRequested;
        /// <summary>bool = player won.</summary>
        public static event Action<BossDefinition, bool> OnBossFightEnded;

        public static void RequestBossFight(BossDefinition boss) => OnBossFightRequested?.Invoke(boss);
        public static void RaiseBossFightEnded(BossDefinition boss, bool playerWon) => OnBossFightEnded?.Invoke(boss, playerWon);

        // ---------- Übungsstunden (requested by W2, loaded by W1, played by W5) ----------
        public static event Action<UebungDefinition> OnUebungRequested;
        /// <summary>int = XP earned.</summary>
        public static event Action<UebungDefinition, int> OnUebungEnded;

        public static void RequestUebung(UebungDefinition uebung) => OnUebungRequested?.Invoke(uebung);
        public static void RaiseUebungEnded(UebungDefinition uebung, int xpEarned) => OnUebungEnded?.Invoke(uebung, xpEarned);

        // ---------- Scenes (handled by W1 SceneLoader) ----------
        /// <summary>sceneName, spawnId (may be null).</summary>
        public static event Action<string, string> OnSceneChangeRequested;

        public static void RequestScene(string sceneName, string spawnId = null) => OnSceneChangeRequested?.Invoke(sceneName, spawnId);

        // ---------- Audio (handled by W1 AudioManager, clips from W5) ----------
        public static event Action<string> OnSfxRequested;
        public static event Action<string> OnMusicRequested;

        public static void RequestSfx(string sfxId) => OnSfxRequested?.Invoke(sfxId);
        public static void RequestMusic(string musicId) => OnMusicRequested?.Invoke(musicId);

        // ---------- Input lock (e.g. during dialogue, transitions) ----------
        public static event Action<bool> OnPlayerInputLockChanged;

        public static void SetPlayerInputLocked(bool locked) => OnPlayerInputLockChanged?.Invoke(locked);
    }
}
