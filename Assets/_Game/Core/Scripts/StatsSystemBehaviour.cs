using UnityEngine;

namespace EthGame.Core
{
    /// <summary>Connects the pure stats model to the shared game-event contract.</summary>
    public sealed class StatsSystemBehaviour : MonoBehaviour
    {
        [SerializeField] private XpTable xpTable;

        private StatsSystem _statsSystem;

        private void OnEnable()
        {
            if (xpTable == null)
            {
                Debug.LogError("StatsSystemBehaviour requires an XpTable asset.", this);
                enabled = false;
                return;
            }

            try
            {
                _statsSystem = new StatsSystem(xpTable.GetLevelThresholds());
            }
            catch (System.ArgumentException exception)
            {
                Debug.LogError("The assigned XpTable is invalid: " + exception.Message, this);
                enabled = false;
                return;
            }

            GameEvents.OnStatChangeRequested += HandleStatChangeRequested;
        }

        private void OnDisable()
        {
            GameEvents.OnStatChangeRequested -= HandleStatChangeRequested;
        }

        private void HandleStatChangeRequested(Stat stat, int delta)
        {
            StatsSystem.ChangeResult result = _statsSystem.ApplyChange(stat, delta);
            if (result.Changed)
            {
                GameEvents.RaiseStatChanged(stat, result.NewValue);
            }

            foreach (int level in result.LevelsGained)
            {
                GameEvents.RaiseLevelUp(level);
            }

            if (result.LevelsGained.Count > 0)
            {
                GameEvents.RaiseStatChanged(Stat.Level, _statsSystem.GetValue(Stat.Level));
            }
        }
    }
}