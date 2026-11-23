namespace EthGame.Core
{
    /// <summary>Anything the player can interact with in the overworld (vending machine, door, NPC...).</summary>
    public interface IInteractable
    {
        /// <summary>Short text shown when the player faces this, e.g. "Buy beer (2 CHF)".</summary>
        string PromptText { get; }

        /// <summary>False hides the prompt and ignores input (e.g. machine empty).</summary>
        bool CanInteract { get; }

        void Interact();
    }
}
