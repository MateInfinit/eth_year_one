using UnityEngine;

namespace EthGame.Core
{
    /// <summary>Data for one Übungsstunde (level-up minigame). Assets are created and owned by W5.</summary>
    [CreateAssetMenu(menuName = "EthGame/Uebung Definition", fileName = "Uebung_")]
    public class UebungDefinition : ScriptableObject
    {
        [Tooltip("lowercase_snake_case, e.g. quiz_eprog")]
        public string uebungId;
        public string displayName;
        public string courseName;

        [Tooltip("e.g. Uebung_quiz_eprog")]
        public string sceneName;

        [Tooltip("XP for a perfect score; actual XP = round(xpReward * score)")]
        public int xpReward = 50;
        public int sanityCost = 5;

        [TextArea(2, 5)] public string[] taIntroLines;
    }
}
