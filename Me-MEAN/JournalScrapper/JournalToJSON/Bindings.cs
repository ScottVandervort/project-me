using Ninject;
using Ninject.Modules;

namespace JournalToJSON
{
    public class Bindings : NinjectModule
    {
        public override void Load()
        {
            Bind<IParser>().To<Parser>();
        }
    }
}
